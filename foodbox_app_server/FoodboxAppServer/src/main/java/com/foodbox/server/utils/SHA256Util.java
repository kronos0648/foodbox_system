package com.foodbox.server.utils;

import java.security.MessageDigest;

import org.springframework.stereotype.Component;

/**
 * 패스워드 암호화
 */
@Component
public class SHA256Util {

	public static String encryptionPassword(String pwd) {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			byte[] hash = digest.digest(pwd.getBytes("UTF-8"));
			StringBuffer hexString = new StringBuffer();

			for (int i = 0; i < hash.length; i++) {
				String hex = Integer.toHexString(0xff & hash[i]);
				if (hex.length() == 1)
					hexString.append('0');
				hexString.append(hex);
			}
			return hexString.toString();
		} catch (Exception ex) {
			throw new RuntimeException(ex);
		}
	}
	
}
