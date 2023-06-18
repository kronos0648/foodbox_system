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

import com.foodbox.server.data.ConsumerDTO;
import com.foodbox.server.data.LoginRequest;
import com.foodbox.server.data.OrdersDTO;
import com.foodbox.server.data.StoreDTO;
import com.foodbox.server.exception.CustomException;
import com.foodbox.server.exception.ExceptionMessage;
import com.foodbox.server.service.ConsumerService;
import com.foodbox.server.service.IoTService;
import com.foodbox.server.utils.TokenUtil;

/**
 * 소비자 컨트롤러
 */
@RestController
@RequestMapping("consumer")
public class ConsumerController {
	private final ConsumerService consumerService;
	private final IoTService ioTService;
	private final RedisTemplate<String, Object> redisTemplate;

	public ConsumerController(ConsumerService consumerService, IoTService ioTService, RedisTemplate<String, Object> redisTemplate) {
		this.consumerService = consumerService;
		this.ioTService = ioTService;
		this.redisTemplate = redisTemplate;
	}

	/**
	 * 소비자 ID 중복 확인
	 * 소비자가 계정을 등록할 때 입력한 소비자 ID에 대한 중복 확인 요청
	 * 
	 * @param cons_id 소비자 ID
	 * @return isIdExist ID 중복 여부 값
	 */
	@GetMapping("/idcheck")
	public Map<String, Boolean> idCheck(String cons_id) {
		Map<String, Boolean> resultMap = new HashMap<String, Boolean>();
		resultMap.put("isIdExist", consumerService.idExist(cons_id));
		return resultMap;
	}

	/**
	 * 소비자 계정 등록
	 * 소비자가 계정을 등록할 때 계정 정보에 대한 저장 요청
	 * 소비자 계정 생성 성공 시 201, 계정 성공 실패 시 400
	 * 
	 * @param cons_id 소비자 ID
	 * @param cons_pw 소비자 비밀번호
	 */
	@PostMapping("/register")
	public ResponseEntity<Object> register(@RequestBody ConsumerDTO consumerDTO) {
		if(!consumerService.register(consumerDTO)) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	/**
	 * 소비자 로그인
	 * 소비자가 로그인할 때 입력한 정보에 대한 유효성을 검증하고 로그인 가능 여부를 안내
	 * 로그인 성공 시 사용자 아이디와 Access Token 및 Refresh Token을 발급하여 전달한다.
	 * 소비자 로그인 성공 시 200, 실패 시 401
	 * 
	 * @param id 소비자 ID
	 * @param pw 소비자 비밀번호
	 * @return 소비자 로그인 성공 시 cons_id 소비자 ID
	 */
	@GetMapping("/login")
	public ResponseEntity<Map<String, Object>> login(@RequestParam("cons_id") String id, @RequestParam("cons_pw") String pw) {
		LoginRequest loginRequest = new LoginRequest(id, pw);
		if (!consumerService.login(loginRequest)) {
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}
		Map<String, Object> resultMap = TokenUtil.createToken(id, "consumer");
		resultMap.put("cons_id", id);

		long refExp = (long)resultMap.get("refresh_token_expires_in");
		// Refresh Token 저장
		// Key : CRT:소비자 아이디
		// Refresh Token 만료 시간을 함께 저장한다.
		redisTemplate.opsForValue().set("CRT:" + id,
				resultMap.get("refresh_token"),
				refExp,
				TimeUnit.MILLISECONDS);
		return new ResponseEntity<>(resultMap, HttpStatus.OK);
	}

	/**
	 * 소비자 FCM Target Token 등록
	 * @param target_token 파이어베이스에서 발급한 앱 구동 기기의 고유 Target Token
	 */
	@PostMapping("/fcm")
	@ResponseStatus(HttpStatus.CREATED)
	public void addTargetToken(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> map) {
		String cons_id = TokenUtil.getId(token);
		String targetToken = map.get("target_token");
		// FCM Target Token 저장
		// Key : CFCM:소비자 아이디
		redisTemplate.opsForValue().set("CFCM:" + cons_id, targetToken);
	}
	
	/**
	 * 소비자 로그아웃
	 */
	@PostMapping("/logout")
	@ResponseStatus(HttpStatus.CREATED)
	public void loggout(@RequestHeader("Authorization") String token) {
		String logout = token.replace("Bearer ", "");
		// 로그아웃 시 해당 Access Token 재사용이 불가능하도록 저장
		redisTemplate.opsForValue().set("ACCESS:" + logout, logout);
	}

	/**
	 * 소비자 액세스 토큰 재발급
	 * Refresh Token을 이용해 Access Token을 재발급
	 */
	@PostMapping("/reissue")
	public ResponseEntity<Map<String, String>> reissue(@RequestHeader("Authorization") String token) {
		String id = TokenUtil.getId(token);
		String refresh = (String) redisTemplate.opsForValue().get("CRT:" + id);
		// Refresh Token이 만료되었거나 서버에 있는 Refresh Token과 일치하지 않을 경우
		// REFRESH_TOKEN_ERROR 에러 발생
		if(refresh == null || !token.replace("Bearer ", "").equals(refresh)) {
			throw new CustomException(ExceptionMessage.REFRESH_TOKEN_ERROR);
		}
		return new ResponseEntity<>(TokenUtil.createAccess(id, "consumer"), HttpStatus.OK);
	}

	/**
	 * 배달 주문 요청
	 * 소비자가 배달 주문을 할 때 앱 서버에 요청
	 * 배달 주문 요청 성공 시 201, 실패 시 400
	 * 
	 * @param token 소비자의 JWT 토큰
	 * @param store_id 주문 대상 가게 아이디
	 */
	@PostMapping("/order")
	public ResponseEntity<Object> order(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> req) {
		String cons_id = TokenUtil.getId(token);
		String store_id = req.get("store_id");

		if(!consumerService.order(cons_id, store_id)) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	/**
	 * 기기 잠금 해제 요청
	 * 소비자가 배달 주문에 할당된 기기에 대해 잠금 해제를 요청
	 * 
	 * @param order_id 주문 식별번호
	 */
	@PostMapping("/done")
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Object> done(@RequestBody OrdersDTO ordersDTO) {
		if(!ioTService.done(ordersDTO)) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	/**
	 * 가게 목록 전송
	 * 소비자가 주문 가능한 가게에 대해 목록을 전송하기를 요청
	 * 
	 * @return 가게 목록
	 */
	@GetMapping("/store_list")
	public Map<String, List<StoreDTO>> store_list() {
		Map<String, List<StoreDTO>> resultMap = new HashMap<String,List<StoreDTO>>();
		resultMap.put("store_list", consumerService.getStoreList());
		return resultMap;
	}

	/**
	 * 주문 목록 전송
	 * 소비자가 자신의 주문에 대해 목록을 전송하기를 요청
	 * 
	 * @param token JWT 토큰
	 * @return 주문 목록
	 */
	@GetMapping("/order_list")
	public Map<String, List<OrdersDTO>> order_list(@RequestHeader("Authorization") String token) {
		String cons_id = TokenUtil.getId(token);
		Map<String, List<OrdersDTO>> resultMap = new HashMap<String, List<OrdersDTO>>();
		resultMap.put("order_list", consumerService.order_list(cons_id));
		return resultMap;
	}

	/**
	 * 주문 정보 전송
	 * 소비자가 주문 목록 중 자신이 선택한 주문에 대해 정보를 전송하기를 요청
	 * 
	 * @param order_id 주문 식별 번호
	 * @return 주문 정보
	 */
	@GetMapping("/order_spec")
	public OrdersDTO order_spec(int order_id) {
		return consumerService.order_spec(order_id);
	}

}
