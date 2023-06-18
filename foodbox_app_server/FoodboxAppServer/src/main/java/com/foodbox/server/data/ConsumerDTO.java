package com.foodbox.server.data;

import com.foodbox.server.utils.SHA256Util;

public class ConsumerDTO {
	private String cons_id; // 소비자 ID
	private String cons_pw; // 소비자 비밀번호
	
	public ConsumerDTO(String cons_id, String cons_pw) {
		this.cons_id = cons_id;
		this.cons_pw = SHA256Util.encryptionPassword(cons_pw);
	}
	
}