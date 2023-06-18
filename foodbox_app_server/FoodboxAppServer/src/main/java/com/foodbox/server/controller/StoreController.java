package com.foodbox.server.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.foodbox.server.data.LoginRequest;
import com.foodbox.server.data.OrdersDTO;
import com.foodbox.server.data.StoreDTO;
import com.foodbox.server.exception.CustomException;
import com.foodbox.server.exception.ExceptionMessage;
import com.foodbox.server.service.IoTService;
import com.foodbox.server.service.StoreService;
import com.foodbox.server.utils.TokenUtil;

/**
 * 가게 컨트롤러
 */
@RestController
@RequestMapping("store")
public class StoreController {
	private final StoreService storeService;
	private final IoTService ioTService;
	private final RedisTemplate<String, Object> redisTemplate;

	public StoreController(StoreService storeService, IoTService ioTService,
			RedisTemplate<String, Object> redisTemplate) {
		this.storeService = storeService;
		this.ioTService = ioTService;
		this.redisTemplate = redisTemplate;
	}

	/**
	 * 가게 ID 중복 확인
	 * 가게가 계정을 등록할 때 입력한 가게 ID에 대한 중복 확인 요청
	 * 
	 * @param store_id 가게 ID
	 * @return isIdExist ID 중복 여부 값
	 */
	@GetMapping("/idcheck")
	public Map<String, Boolean> idCheck(String store_id) {
		Map<String, Boolean> resultMap = new HashMap<String, Boolean>();
		resultMap.put("isIdExist", storeService.idExist(store_id));
		return resultMap;
	}

	/**
	 * 가게 계정 등록
	 * 가게가 계정을 등록할 때 계정 정보에 대한 저장 요청
	 * 가게 계정 생성 성공 시 201, 계정 성공 실패 시 400
	 * 
	 * @param store_id 가게 ID
	 * @param store_pw 가게 비밀번호
	 * @param store_name 가게명
	 */
	@PostMapping("/register")
	public ResponseEntity<Object> register(@RequestBody StoreDTO storeDTO) {
		if(!storeService.register(storeDTO)) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	/**
	 * 가게 로그인
	 * 가게가 로그인할 때 입력한 정보에 대한 유효성을 검증하고 로그인 가능 여부를 안내
	 * 로그인 성공 시 사용자 아이디와 Access Token 및 Refresh Token을 발급하여 전달한다.
	 * 가게 로그인 성공 시 200, 실패 시 401
	 * 
	 * @param id 가게 ID
	 * @param pw 가게 비밀번호
	 * @return 가게 로그인 성공 시 store_id 가게 ID
	 */
	@GetMapping("/login")
	public ResponseEntity<Map<String, Object>> login(@RequestParam("store_id") String id, @RequestParam("store_pw") String pw) {
		LoginRequest loginRequest = new LoginRequest(id, pw);
		if (!storeService.login(loginRequest)) {
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}
		Map<String, Object> resultMap = TokenUtil.createToken(id, "store");
		resultMap.put("store_id", id);
		
		long refExp = (long)resultMap.get("refresh_token_expires_in");
		// Refresh Token 저장
		// Key : SRT:가게 아이디
		// Refresh Token 만료 시간을 함께 저장한다.
		redisTemplate.opsForValue().set("SRT:" + id,
										resultMap.get("refresh_token"),
										refExp,
										TimeUnit.MILLISECONDS);
		return new ResponseEntity<>(resultMap, HttpStatus.OK);
	}

	/**
	 * 가게 FCM Target Token 등록
	 * @param target_token 파이어베이스에서 발급한 앱 구동 기기의 고유 Target Token
	 */
	@PostMapping("/fcm")
	@ResponseStatus(HttpStatus.CREATED)
	public void addTargetToken(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> map) {
		String store_id = TokenUtil.getId(token);
		String targetToken = map.get("target_token");
		// FCM Target Token 저장
		// Key : SFCM:가게 아이디
		redisTemplate.opsForValue().set("SFCM:" + store_id, targetToken);
	}
	
	/**
	 * 가게 로그아웃
	 */
	@PostMapping("/logout")
	@ResponseStatus(HttpStatus.CREATED)
	public void loggout(@RequestHeader("Authorization") String token) {
		String logout = token.replace("Bearer ", "");
		// 로그아웃 시 해당 Access Token 재사용이 불가능하도록 저장
		redisTemplate.opsForValue().set("ACCESS:" + logout, logout);
	}

	/**
	 * 가게 액세스 토큰 재발급
	 * Refresh Token을 이용해 Access Token을 재발급
	 */
	@PostMapping("/reissue")
	public ResponseEntity<Map<String, String>> reissue(@RequestHeader("Authorization") String token) {
		String id = TokenUtil.getId(token);
		String refresh = (String) redisTemplate.opsForValue().get("SRT:" + id);
		// Refresh Token이 만료되었거나 서버에 있는 Refresh Token과 일치하지 않을 경우
		// REFRESH_TOKEN_ERROR 에러 발생
		if(refresh == null || !token.replace("Bearer ", "").equals(refresh)) {
			throw new CustomException(ExceptionMessage.REFRESH_TOKEN_ERROR);
		}
		return new ResponseEntity<>(TokenUtil.createAccess(id, "store"), HttpStatus.OK);
	}
	
	/**
	 * 기기 주문 할당
	 * 가게가 주문에 대해 기기를 할당하기를 요청
	 * 기기 할당 성공 시 201, 실패 시 400
	 * 
	 * @param order_id 주문 식별번호
	 * @param dev_id 기기 식별번호
	 */
	@PostMapping("/allocation")
	public ResponseEntity<Object> allocation(@RequestBody OrdersDTO ordersDTO) {
		if(!ioTService.allocation(ordersDTO)) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	/**
	 * 기기 주문 할당 해제
	 * 가게가 주문에 대한 기기 할당을 해제하기를 요청
	 * 기기 할당 해제 성공 시 201, 실패 시 400
	 * 
	 * @param order_id 주문 식별번호
	 */
	@PostMapping("/dismission")
	public ResponseEntity<Object> dismission(@RequestBody OrdersDTO ordersDTO) {
		if(!ioTService.dismission(ordersDTO)) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	/**
	 * 기기 잠금 활성화
	 * 가게가 주문에 할당된 기기의 잠금을 활성화하기를 요청
	 * 기기 잠금 성공 시 201, 실패 시 400
	 * 
	 * @param order_id 주문 식별번호
	 */
	@PostMapping("/lock")
	public ResponseEntity<Object> lock(@RequestBody OrdersDTO ordersDTO) {
		if(!ioTService.lock(ordersDTO)) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	/**
	 * 기기 잠금 비활성화
	 * 가게가 주문에 할당된 기기의 잠금을 비활성화하기를 요청
	 * 기기 잠금 해제 성공 시 201, 실패 시 400
	 * 
	 * @param order_id 주문 식별번호
	 */
	@PostMapping("/unlock")
	public ResponseEntity<Object> unlock(@RequestBody OrdersDTO ordersDTO) {
		if(!ioTService.unlock(ordersDTO)) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	/**
	 * 배달 시작 안내 요청
	 * 가게가 주문에 대해 배달 시작 안내를 요청
	 * 요청 성공 시 201, 실패 시 400
	 * 
	 * @param order_id 주문 식별번호
	 */
	@PostMapping("/start")
	public ResponseEntity<Object> start(@RequestBody OrdersDTO ordersDTO) {
		if(!ioTService.start(ordersDTO)) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	/**
	 * 주문 접수 목록 전송
	 * 가게가 주문 접수 목록을 요청할 때 전송하는 기능
	 * 
	 * @param token JWT 토큰
	 * @return 주문 목록
	 */
	@GetMapping("/order_list")
	public Map<String, List<OrdersDTO>> order_list(@RequestHeader("Authorization") String token) {
		String store_id = TokenUtil.getId(token);
		Map<String, List<OrdersDTO>> resultMap = new HashMap<String, List<OrdersDTO>>();
		resultMap.put("order_list", storeService.order_list(store_id));
		return resultMap;
	}

	/**
	 * 주문 접수 정보 전송
	 * 가게가 특정 주문 접수 정보를 요청할 때 전송하는 기능
	 * 
	 * @param order_id 주문 식별 번호
	 * @return 주문 정보
	 */
	@GetMapping("/order_spec")
	public OrdersDTO order_spec(int order_id) {
		return storeService.order_spec(order_id);
	}
	
}