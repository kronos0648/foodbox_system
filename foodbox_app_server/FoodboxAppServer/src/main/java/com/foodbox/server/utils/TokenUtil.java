package com.foodbox.server.utils;

import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

/**
 * JWT 토큰
 */
@Component
public class TokenUtil {
	private static String SECRET_KEY;
	private static String ACCESS_TIME;
	private static String REFRESH_TIME;

	@Value("${jwt.securitykey}")
	public void setSetSECRET_KEY(String SECRET_KEY) {
		TokenUtil.SECRET_KEY = SECRET_KEY;
	}

	@Value("${jwt.access}")
	public void setACCESS_TIME(String ACCESS_TIME) {
		TokenUtil.ACCESS_TIME = ACCESS_TIME;
	}

	@Value("${jwt.refresh}")
	public void setREFRESH_TIME(String REFRESH_TIME) {
		TokenUtil.REFRESH_TIME = REFRESH_TIME;
	}

	/**
	 * Access Token 발급 및 Refresh Token 발급
	 * 
	 * @param id 사용자 ID
	 * @param role 사용자 권한
	 */
	public static Map<String, Object> createToken(String id, String role) {
		Map<String, Object> headerMap = new HashMap<String, Object>();
		headerMap.put("alg", "HS256");
		headerMap.put("typ", "JWT");

		SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

		Map<String, Object> tokenMap = new LinkedHashMap<>();
		tokenMap.put("id" , id);
		tokenMap.put("role" , role);

		long accessEXP = System.currentTimeMillis() + Long.parseLong(ACCESS_TIME);
		String accessToken = Jwts.builder()
				.setHeaderParams(headerMap)
				.signWith(signatureAlgorithm, SECRET_KEY.getBytes())
				.setSubject(id)
				.setClaims(tokenMap)
				.setExpiration(new Date(accessEXP))
				.compact();

		long refreshEXP = System.currentTimeMillis() + Long.parseLong(REFRESH_TIME);
		String refreshToken = Jwts.builder()
				.setHeaderParams(headerMap)
				.signWith(signatureAlgorithm, SECRET_KEY.getBytes())
				.setSubject(id)
				.setClaims(tokenMap)
				.setExpiration(new Date(refreshEXP))
				.compact();

		Map<String, Object> resultMap = new LinkedHashMap<>();
		resultMap.put("access_token", accessToken);
		resultMap.put("refresh_token", refreshToken);
		resultMap.put("refresh_token_expires_in", refreshEXP);
		return resultMap;
	}

	/**
	 * Access Token 발급
	 * @param id 사용자 ID
	 * @param role 사용자 권한
	 */
	public static HttpHeaders createAccess(String id, String role) {
		Map<String, Object> headerMap = new HashMap<String, Object>();
		headerMap.put("alg", "HS256");
		headerMap.put("typ", "JWT");

		SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

		Map<String, Object> tokenMap = new LinkedHashMap<>();
		tokenMap.put("id" , id);
		tokenMap.put("role" , role);
		
		long accessEXP = System.currentTimeMillis() + Long.parseLong(ACCESS_TIME);
		String accessToken = Jwts.builder()
				.setHeaderParams(headerMap)
				.signWith(signatureAlgorithm, SECRET_KEY.getBytes())
				.setSubject(id)
				.setClaims(tokenMap)
				.setExpiration(new Date(accessEXP))
				.compact();
		
		HttpHeaders headers = new HttpHeaders();
		headers.setBearerAuth(accessToken);
		return headers;
	}
	
	/**
	 * Token으로부터 사용자의 아이디를 가져옴
	 * 토큰이 올바르지 않다면 JWTDecodeException 발생
	 */
	public static String getId(String token) {
		String id = "";
		try {
			DecodedJWT decode = JWT.decode(token.replace("Bearer ", ""));
			id = decode.getClaims().get("id").asString();
		} catch (JWTDecodeException decodeEx) {
			id = "Decode Error";
		}
		return id;
	}

	/**
	 * Token으로부터 사용자의 권한을 가져옴
	 * 토큰이 올바르지 않다면 JWTDecodeException 발생
	 */
	public static String getRole(String token) {
		String role = "";
		try {
			DecodedJWT decode = JWT.decode(token.replace("Bearer ", ""));
			role = decode.getClaims().get("role").asString();
		} catch (JWTDecodeException decodeEx) {
			role = "Decode Error";
		}
		return role;
	}

	/**
	 * JWT 토큰 검증
	 * 검증에 실패할 경우 JwtException 발생
	 */
	public static boolean verifyToken(String token) {
		try {
			Jwts.parser()
			.setSigningKey(SECRET_KEY.getBytes())
			.parseClaimsJws(token.replace("Bearer ", "")).getBody();
		} catch(JwtException e) {
			return false;
		}
		return true;
	}
}