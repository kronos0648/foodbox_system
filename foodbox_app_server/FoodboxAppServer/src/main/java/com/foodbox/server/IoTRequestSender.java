package com.foodbox.server;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Component
public class IoTRequestSender {
	private static String reqURL;
	
	@Value("${iot.request.url}")
	public void setReqURL(String reqURL) {
		IoTRequestSender.reqURL = reqURL;
	}

	/**
	 * 기기 주문 할당 요청
	 * 앱 서버가 IoT 허브에게 기기에 대한 주문 할당을 요청
	 * 
	 * @param dev_id 기기 식별번호
	 */
	public void allocation(int dev_id) {
		MultiValueMap<String, String> header = new LinkedMultiValueMap<>();
		header.add("Content-type", "application/json;charset=UTF-8");

		Map<String, Integer> param = new HashMap<>();
		param.put("dev_id", dev_id);

		HttpEntity<Map<String, Integer>> req = new HttpEntity<>(param, header);

		RestTemplate restTemplate = new RestTemplate();
		restTemplate.exchange(
				reqURL + "/allocation",
				HttpMethod.POST,
				req,
				HttpStatus.class
				);
	}

	/**
	 * 기기 할당 해제 요청
	 * 앱 서버가 IoT 허브에게 기기에 대한 주문 할당 해제를 요청
	 * 
	 * @param dev_id 기기 식별번호
	 */
	public void dismission(int dev_id) {
		MultiValueMap<String, String> header = new LinkedMultiValueMap<>();
		header.add("Content-type", "application/json;charset=UTF-8");

		Map<String, Integer> param = new HashMap<>();
		param.put("dev_id", dev_id);

		HttpEntity<Map<String, Integer>> req = new HttpEntity<>(param, header);

		RestTemplate restTemplate = new RestTemplate();
		restTemplate.exchange(
				reqURL + "/dismission",
				HttpMethod.POST,
				req,
				HttpStatus.class
				);
	}

	/**
	 * 기기 잠금 요청
	 * 앱 서버가 IoT 허브에게 기기에 대한 잠금을 요청
	 * 
	 * @param dev_id 기기 식별번호
	 */
	public void lock(int dev_id) {
		MultiValueMap<String, String> header = new LinkedMultiValueMap<>();
		header.add("Content-type", "application/json;charset=UTF-8");

		Map<String, Integer> param = new HashMap<>();
		param.put("dev_id", dev_id);

		HttpEntity<Map<String, Integer>> req = new HttpEntity<>(param, header);

		RestTemplate restTemplate = new RestTemplate();
		restTemplate.exchange(
				reqURL + "/lock",
				HttpMethod.POST,
				req,
				HttpStatus.class
				);
	}
	
	/**
	 * 기기 잠금 해제 요청
	 * 앱 서버가 IoT 허브에게 기기에 대한 잠금 해제를 요청
	 * 
	 * @param dev_id 기기 식별번호
	 */
	public void unlock(int dev_id) {
		MultiValueMap<String, String> header = new LinkedMultiValueMap<>();
		header.add("Content-type", "application/json;charset=UTF-8");

		Map<String, Integer> param = new HashMap<>();
		param.put("dev_id", dev_id);

		HttpEntity<Map<String, Integer>> req = new HttpEntity<>(param, header);

		RestTemplate restTemplate = new RestTemplate();
		restTemplate.exchange(
				reqURL + "/unlock",
				HttpMethod.POST,
				req,
				HttpStatus.class
				);
	}
}
