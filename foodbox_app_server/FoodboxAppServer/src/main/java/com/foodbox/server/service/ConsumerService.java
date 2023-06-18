package com.foodbox.server.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.foodbox.server.data.ConsumerDTO;
import com.foodbox.server.data.LoginRequest;
import com.foodbox.server.data.OrdersDTO;
import com.foodbox.server.data.StoreDTO;
import com.foodbox.server.mapper.ConsumerMapper;

/**
 * 소비자 서비스
 */
@Service
public class ConsumerService {
	private ConsumerMapper consumerMapper;
	
	public ConsumerService(ConsumerMapper consumerMapper) {
		this.consumerMapper = consumerMapper;
	}

	/**
	 * 소비자 ID 중복 확인
	 * 
	 * @param cons_id 소비자 ID
	 * @return 중복인 경우 true, 중복되지 않은 경우 false
	 */
	public boolean idExist(String cons_id) {
		return consumerMapper.idExist(cons_id);
	}
	
	/**
	 * 소비자 계정 등록
	 * 
	 * @param cons_id 소비자 ID
	 * @param cons_pw 소비자 비밀번호
	 * @return 성공인 경우 true, 실패인 경우 false
	 */
	public boolean register(ConsumerDTO consumerDTO) {
		try {
			consumerMapper.register(consumerDTO);
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	/**
	 * 소비자 로그인
	 * 
	 * @param id 소비자 ID
	 * @param pw 소비자 비밀번호
	 * @return 성공인 경우 true, 실패인 경우 false
	 */
	public boolean login(LoginRequest loginRequest) {
		return consumerMapper.login(loginRequest);
	}
	
	/**
	 * 배달 주문 요청
	 * 
	 * @param cons_id 소비자 ID
	 * @param store_id 주문 대상 가게 ID
	 * @return 주문 요청이 성공인 경우 true, 실패인 경우 false
	 */
	public boolean order(String cons_id, String store_id) {
		try {
			consumerMapper.order(cons_id, store_id);
		} catch (Exception e) {
			return false;
		}
		return true;
	}
	
	/**
	 * 가게 목록 전송
	 * 
	 * @return 가게 목록
	 */
	public List<StoreDTO> getStoreList() {
		return consumerMapper.getStoreList();
	}
	
	/**
	 * 주문 목록 전송
	 * 
	 * @param cons_id 소비자 ID
	 * @return 주문 목록
	 */
	public List<OrdersDTO> order_list(String cons_id) {
		return consumerMapper.getOrderList(cons_id);
	}

	/**
	 * 주문 정보 전송
	 * 
	 * @param order_id 주문 식별 번호
	 * @return 주문 정보
	 */
	public OrdersDTO order_spec(int order_id) {
		return consumerMapper.getOrderSpec(order_id);
	}
	
}
