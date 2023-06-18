package com.foodbox.server.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.foodbox.server.IoTRequestSender;
import com.foodbox.server.data.OrdersDTO;
import com.foodbox.server.mapper.StoreMapper;
import com.foodbox.server.websocket.ConsumerAppWebSocketHandler;
import com.foodbox.server.websocket.StoreAppWebSocketHandler;

import lombok.RequiredArgsConstructor;

/**
 * IoT 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional
public class IoTService {
	private final StoreService storeService;
	private final FirebaseCloudMessageService firebaseCloudMessageService;
	private final IoTRequestSender ioTRequestSender;
	private final ConsumerAppWebSocketHandler consumerHandler;
	private final StoreAppWebSocketHandler storeHandler;
	private final RedisTemplate<String, Object> redisTemplate;
	private final StoreMapper storeMapper;

	/**
	 * 기기 주문 할당
	 * 가게가 주문에 대해 기기를 할당할 때 수행
	 * 
	 * @param order_id 주문 식별번호
	 * @param dev_id 기기 식별번호
	 * @return 성공인 경우 true, 실패인 경우 false
	 */
	public boolean allocation(OrdersDTO ordersDTO) {
		try {
			ioTRequestSender.allocation(ordersDTO.getDev_id());
			storeService.allocation(ordersDTO);
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	/**
	 * 기기 주문 할당 해제
	 * 가게가 주문에 대해 기기의 할당을 해제할 때 수행
	 * 
	 * @param order_id 주문 식별번호
	 * @return 성공인 경우 true, 실패인 경우 false
	 */
	public boolean dismission(OrdersDTO ordersDTO) {
		int order_id = ordersDTO.getOrder_id();
		try {
			int dev_id = storeService.selectDevId(order_id);
			ioTRequestSender.dismission(dev_id);
			storeService.dismission(order_id);
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	/**
	 * 기기 잠금 활성화
	 * 가게가 주문에 할당된 기기를 잠글 때 수행
	 * 
	 * @param order_id 주문 식별번호
	 * @return 성공인 경우 true, 실패인 경우 false
	 */
	public boolean lock(OrdersDTO ordersDTO) {
		try {
			int dev_id = storeService.selectDevId(ordersDTO.getOrder_id());
			ioTRequestSender.lock(dev_id);
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	/**
	 * 기기 잠금 비활성화
	 * 가게가 주문에 할당된 기기의 잠금을 해제할 때 수행
	 * 
	 * @param order_id 주문 식별번호
	 * @return 성공인 경우 true, 실패인 경우 false
	 */
	public boolean unlock(OrdersDTO ordersDTO) {
		try {
			int dev_id = storeService.selectDevId(ordersDTO.getOrder_id());
			ioTRequestSender.unlock(dev_id);
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	/**
	 * 배달 시작
	 * 가게가 배달을 시작할 때 수행
	 * 
	 * @param order_id 주문 식별번호
	 * @return 성공인 경우 true, 실패인 경우 false
	 */
	public boolean start(OrdersDTO ordersDTO) {
		int order_id = ordersDTO.getOrder_id();
		try {
			int dev_id = storeService.selectDevId(order_id);
			String cons_id = storeService.selectConsId(order_id);
			String store_name = storeService.selectStoreName(order_id);
			ioTRequestSender.lock(dev_id);
			storeMapper.start(order_id);
			
			// firebaseCloudMessageService.sendMessageTo(
			// 		(String) redisTemplate.opsForValue().get("CFCM:" + cons_id),
			// 		"FoodBox",
			// 		order_id + ":" + store_name + "에 주문한 음식의 배달이 시작되었습니다."
			// );
//			try {
//				consumerHandler.deliveryStart(order_id, cons_id);
//			} catch (Exception e) {
//				// TODO: handle exception
//			}
		} catch (Exception e) {
			return false;
		}
		return true;
	}
	
	/**
	 * 배달 완료
	 * 소비자가 배달받은 기기의 잠금을 해제하며 수행
	 * 
	 * @param order_id 주문 식별번호
	 * @return 성공인 경우 true, 실패인 경우 false
	 */
	public boolean done(OrdersDTO ordersDTO) {
		int order_id = ordersDTO.getOrder_id();
		try {
			int dev_id = storeService.selectDevId(order_id);
			String cons_id = storeService.selectConsId(order_id);
			String store_id = storeService.selectStoreId(order_id);
			ioTRequestSender.unlock(dev_id);
			storeMapper.done(order_id);
						
			// firebaseCloudMessageService.sendMessageTo(
			// 		(String) redisTemplate.opsForValue().get("SFCM:" + store_id),
			// 		"FoodBox",
			// 		order_id + ":" + cons_id + "에 배달한 음식의 수령이 완료되었습니다."
			// );
//			try {
//				storeHandler.deliveryDone(order_id, cons_id);
//			} catch (Exception e) {
//				// TODO: handle exception
//			}
		} catch (Exception e) {
			return false;
		}
		return true;
	}
	
}