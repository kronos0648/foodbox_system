package com.foodbox.server.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.foodbox.server.exception.CustomException;
import com.foodbox.server.exception.ExceptionMessage;
import com.foodbox.server.utils.TokenUtil;

@Component
public class ConsumerInterceptor implements HandlerInterceptor {
	private final RedisTemplate<String, String> redisTemplate;

	public ConsumerInterceptor(RedisTemplate<String, String> redisTemplate) {
		this.redisTemplate = redisTemplate;
	}
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		String token = request.getHeader("Authorization");
		
		/**
		 * JWT 토큰 존재 여부 확인
		 */
		if(token == null) {
			throw new CustomException(ExceptionMessage.TOKEN_NULL);
		}
		
		String isLogout = redisTemplate.opsForValue().get("ACCESS:" + token.replace("Bearer ", ""));

		/**
		 * JWT 토큰 검증
		 */
		if(isLogout != null || !TokenUtil.verifyToken(token)) {
			throw new CustomException(ExceptionMessage.UNAUTHORIZED_USER);
		}
		
		/**
		 * JWT 토큰 권한 확인
		 */
		if(!TokenUtil.getRole(token).equals("consumer")) {
			throw new CustomException(ExceptionMessage.FORBIDDEN_USER);
		}
		
		return true;
	}
	
}