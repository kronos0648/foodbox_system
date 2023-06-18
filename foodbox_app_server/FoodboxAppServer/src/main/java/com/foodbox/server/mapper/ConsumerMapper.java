package com.foodbox.server.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.foodbox.server.data.ConsumerDTO;
import com.foodbox.server.data.LoginRequest;
import com.foodbox.server.data.OrdersDTO;
import com.foodbox.server.data.StoreDTO;

@Mapper
public interface ConsumerMapper {
	boolean idExist(String cons_id); // 소비자 ID 중복 확인
	int register(ConsumerDTO consumerDTO); // 소비자 계정 등록
	boolean login(LoginRequest loginRequest); // 소비자 로그인
	int order(String cons_id, String store_id); // 배달 주문 요청
	List<StoreDTO> getStoreList(); // 가게 목록 전송
	List<OrdersDTO> getOrderList(String cons_id); // 주문 목록 전송
	OrdersDTO getOrderSpec(int order_id); // 주문 정보 전송
}
