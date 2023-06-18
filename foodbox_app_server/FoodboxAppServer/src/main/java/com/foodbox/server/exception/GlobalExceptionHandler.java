package com.foodbox.server.exception;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(CustomException.class)
	public ResponseEntity<Map<String, String>> customExceptionHandler(HttpServletRequest request, CustomException e) {
		Map<String, String> resultMap = new HashMap<String, String>();
		resultMap.put("error", e.getExceptionMessage().getMessage());
		return ResponseEntity.status(e.getExceptionMessage().getStatus())
				.body(resultMap);
	}
}