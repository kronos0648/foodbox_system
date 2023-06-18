package com.foodbox.server.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.foodbox.server.data.LoginRequest;
import com.foodbox.server.data.OrdersDTO;
import com.foodbox.server.data.StoreDTO;

@Mapper
public interface StoreMapper {
	boolean idExist(String store_id); // 가게 ID 중복 확인
	int register(StoreDTO storeDTO); // 가게 계정 등록
	boolean login(LoginRequest loginRequest); // 가게 로그인
	int selectDevId(int order_id); // 기기 식별번호 확인
	String selectConsId(int order_id); // 주문을 요청한 소비자 아이디 확인
	String selectStoreId(int order_id); // 주문 식별 번호로 가게 아이디 확인
	String selectStoreName(int order_id); // 주문 식별 번호로 가게 이름 확인
	int allocation(OrdersDTO ordersDTO); // 기기 주문 할당
	int dismission(int order_id); // 기기 주문 할당 해제
	int start(int order_id); // 배달 시작 안내 요청
	int done(int order_id); // 배달 완료 안내 요청
	List<OrdersDTO> getOrderList(String store_id); // 주문 접수 목록 전송
	OrdersDTO getOrderSpec(int order_id); // 주문 접수 정보 전송
}