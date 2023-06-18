package com.foodbox.server.websocket;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.foodbox.server.utils.TokenUtil;

@Component
public class ConsumerAppWebSocketHandler extends TextWebSocketHandler {
	private static final ConcurrentHashMap<String, WebSocketSession> CLIENTS = new ConcurrentHashMap<String, WebSocketSession>();

	char stx = (char) 2;
	char etx = (char) 3;

	/**
	 * 배달 시작 알림 전송
	 */
	public void deliveryStart(int order_id, String cons_id) throws IOException {
		sendMessage(Character.toString(stx) + "DSS:" + order_id + Character.toString(etx), cons_id);
	}

	/**
	 * 클라이언트가 연결 되었을 때 호출
	 * 메시지 발송을 위해 클라이언트 목록에 해당 세션을 추가한다.
	 */
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		String token = session.getHandshakeHeaders().get("Authorization").get(0);
		CLIENTS.put(TokenUtil.getId(token), session);
	}

	/**
	 * 클라이언트에서 연결을 종료할 경우 호출
	 * 메시지 발송에서 제외하기 위해 클라이언트 목록에서 해당 세션을 제거한다.
	 */
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		String token = session.getHandshakeHeaders().get("Authorization").get(0);
		CLIENTS.remove(TokenUtil.getId(token));
	}

	/**
	 * 클라이언트에게 메시지 전송
	 */
	private void sendMessage(String msg, String cons_id) throws IOException {
		TextMessage message = new TextMessage(msg);
		CLIENTS.get(cons_id).sendMessage(message);
	}

}