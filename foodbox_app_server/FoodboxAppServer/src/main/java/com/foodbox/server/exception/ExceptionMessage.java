package com.foodbox.server.exception;

import org.springframework.http.HttpStatus;

public enum ExceptionMessage {
	TOKEN_NULL(HttpStatus.UNAUTHORIZED, "헤더에 토큰이 존재하지 않습니다."),
	REFRESH_TOKEN_ERROR(HttpStatus.UNAUTHORIZED, "유효하지 않는 Refresh Token"),
	UNAUTHORIZED_USER(HttpStatus.UNAUTHORIZED, "로그인이 필요한 페이지입니다."),
	FORBIDDEN_USER(HttpStatus.FORBIDDEN, "해당 페이지에 접근할 권한이 없습니다.");
	
	private HttpStatus status;
	private String message;
	
	public HttpStatus getStatus() {
		return status;
	}
	public String getMessage() {
		return message;
	}
	
	private ExceptionMessage(HttpStatus status, String message) {
		this.status = status;
		this.message = message;
	}
}
