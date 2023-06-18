package com.foodbox.server.data;

import com.foodbox.server.utils.SHA256Util;

public class LoginRequest {
	private String id;
	private String pw;
	
	public LoginRequest(String id, String pw) {
		this.id = id;
		this.pw = SHA256Util.encryptionPassword(pw);
	}
	
}
