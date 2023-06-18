package com.foodbox.server.data;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.foodbox.server.utils.SHA256Util;

@JsonInclude(JsonInclude.Include.NON_NULL) // NULL 값인 필드 표시 제외
public class StoreDTO {
	private String store_id; // 가게 ID
	private String store_pw; // 가게 비밀번호
	private String store_name; // 가게명
	
	public String getStore_id() {
		return store_id;
	}
	public void setStore_id(String store_id) {
		this.store_id = store_id;
	}
	public String getStore_pw() {
		return store_pw;
	}
	public void setStore_pw(String store_pw) {
		this.store_pw = SHA256Util.encryptionPassword(store_pw);;
	}
	public String getStore_name() {
		return store_name;
	}
	public void setStore_name(String store_name) {
		this.store_name = store_name;
	}
}
