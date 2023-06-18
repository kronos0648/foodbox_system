package com.foodbox.server.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.foodbox.server.data.LoginRequest;
import com.foodbox.server.data.OrdersDTO;
import com.foodbox.server.data.StoreDTO;
import com.foodbox.server.mapper.StoreMapper;

/**
 * 가게 서비스
 */
@Service
public class StoreService {
	private final StoreMapper storeMapper;

	public StoreService(StoreMapper storeMapper) {
		this.storeMapper = storeMapper;
	}

	/**
	 * 가게 ID 중복 확인
	 * 
	 * @param store_id 가게 ID
	 * @return 중복인 경우 true, 중복되지 않은 경우 false
	 */
	public boolean idExist(String store_id) {
		return storeMapper.idExist(store_id);
	}

	/**
	 * 가게 계정 등록
	 * 
	 * @param storeDTO 가게 ID, 가게 비밀번호, 가게명
	 * @return 성공인 경우 true, 실패인 경우 false
	 */
	public boolean register(StoreDTO storeDTO) {
		try {
			storeMapper.register(storeDTO);
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	/**
	 * 가게 로그인
	 * 
	 * @param loginRequest 가게 ID, 가게 비밀번호
	 * @return 성공인 경우 true, 실패인 경우 false
	 */
	public boolean login(LoginRequest loginRequest) {
		return storeMapper.login(loginRequest);
	}

	/**
	 * 기기 주문 할당
	 * 
	 * @param order_id 주문 식별번호
	 * @param dev_id 기기 식별번호
	 */
	public void allocation(OrdersDTO ordersDTO) {
		storeMapper.allocation(ordersDTO);
	}

	/**
	 * 기기 식별번호 확인
	 * 
	 * @param order_id 주문 식별 번호
	 * @return 기기 식별번호
	 */
	public int selectDevId(int order_id) {
		return storeMapper.selectDevId(order_id);
	}

	/**
	 * 주문을 요청한 소비자 아이디 확인
	 * 
	 * @param order_id 주문 식별 번호
	 * @return 소비자 아이디
	 */
	public String selectConsId(int order_id) {
		return storeMapper.selectConsId(order_id);
	}
	
	/**
	 * 주문 식별 번호로 가게 아이디 확인
	 * 
	 * @param order_id 주문 식별번호
	 * @return 가게 아이디
	 */
	public String selectStoreId(int order_id) {
		return storeMapper.selectStoreId(order_id);
	}
	
	/**
	 * 주문 식별 번호로 가게 이름 확인
	 * 
	 * @param order_id 주문 식별번호
	 * @return 가게 이름
	 */
	public String selectStoreName(int order_id) {
		return storeMapper.selectStoreName(order_id);
	}
	
	/**
	 * 기기 주문 할당 해제
	 * 
	 * @param order_id 주문 식별번호
	 */
	public void dismission(int order_id) {
		storeMapper.dismission(order_id);
	}

	/**
	 * 주문 접수 목록 전송
	 * 
	 * @param store_id 가게 ID
	 * @return 주문 목록
	 */
	public List<OrdersDTO> order_list(String store_id) {
		return storeMapper.getOrderList(store_id);
	}

	/**
	 * 주문 접수 정보 전송
	 * 
	 * @param order_id 주문 식별 번호
	 * @return 주문 정보
	 */
	public OrdersDTO order_spec(int order_id) {
		return storeMapper.getOrderSpec(order_id);
	}
	
}
