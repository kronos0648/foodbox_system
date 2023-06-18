package com.foodbox.server.interceptor;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	private final ConsumerInterceptor consumerInterceptor;
	private final StoreInterceptor storeInterceptor;
	
	public WebConfig(ConsumerInterceptor consumerInterceptor, StoreInterceptor storeInterceptor) {
		this.consumerInterceptor = consumerInterceptor;
		this.storeInterceptor = storeInterceptor;
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(consumerInterceptor)
				.addPathPatterns("/consumer/fcm") // 소비자 FCM Target Token 등록
				.addPathPatterns("/consumer/order") // 배달 주문 요청
				.addPathPatterns("/consumer/store_list") // 가게 목록 전송
				.addPathPatterns("/consumer/order_list") // 주문 목록 전송
				.addPathPatterns("/consumer/order_spec**") // 주문 정보 전송
				;
		
		registry.addInterceptor(storeInterceptor)
				.addPathPatterns("/store/fcm") // 가게 FCM Target Token 등록
				.addPathPatterns("/store/allocation") // 기기 주문 할당
				.addPathPatterns("/store/dismission") // 기기 주문 할당 해제
				.addPathPatterns("/store/lock") // 기기 잠금 활성화
				.addPathPatterns("/store/unlock") // 기기 잠금 비활성화
				.addPathPatterns("/store/start") // 배달 시작 안내 요청
				.addPathPatterns("/store/order_list") // 주문 접수 목록 전송
				.addPathPatterns("/store/order_spec**") // 주문 접수 정보 전송
				;
	}
}
