package com.foodbox.server.exception;

public class CustomException extends RuntimeException {
	private static final long serialVersionUID = 3011986313761592046L;
	private ExceptionMessage exceptionMessage;
	
	public ExceptionMessage getExceptionMessage() {
		return exceptionMessage;
	}

	public CustomException(ExceptionMessage exceptionMessage) {
		this.exceptionMessage = exceptionMessage;
	}
}