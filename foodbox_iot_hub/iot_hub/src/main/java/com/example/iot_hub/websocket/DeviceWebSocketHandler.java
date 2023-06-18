package com.example.iot_hub.websocket;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import com.example.iot_hub.data.Device;
import com.example.iot_hub.mapper.DeviceMapper;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class DeviceWebSocketHandler extends TextWebSocketHandler {

    private static final ConcurrentHashMap<String, WebSocketSession> CLIENTS = new ConcurrentHashMap<String, WebSocketSession>();
    private final DeviceMapper deviceMapper;
    private static final ArrayList<String> KEYLIST = new ArrayList<String>();

    public DeviceWebSocketHandler(DeviceMapper deviceMapper) {
        this.deviceMapper = deviceMapper;
    }

    // 기기 할당 여부 변경
    public boolean requestAlloc(int dev_id, boolean alloc) throws IOException {
        String id = Integer.toString(dev_id);
        char stx = (char) 2;
        char etx = (char) 3;
        String reqCode = "ALO:";
        String value = "0";
        if (alloc)
            value = "1";
        String msg = Character.toString(stx) + reqCode + value + Character.toString(etx);
        sendMessage(id, msg);
        return true;
    }

    // 기기 잠금 여부 변경
    public boolean requestLock(int dev_id, boolean lock) throws IOException {
        String id = Integer.toString(dev_id);
        char stx = (char) 2;
        char etx = (char) 3;
        String reqCode = "LCK:";
        String value = "0";
        if (lock)
            value = "1";
        String msg = Character.toString(stx) + reqCode + value + Character.toString(etx);
        sendMessage(id, msg);
        return true;
    }

    // 허브 연결
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        List<String> session_id = session.getHandshakeHeaders().get("dev_id");
        String dev_id = "";
        if (session_id != null) {
            dev_id = session_id.get(0);
            Device device = deviceMapper.deviceForInit(Integer.parseInt(dev_id));
            char alloc = device.getAlloc();
            char lock = device.getLock();
            char stx = (char) 2;
            char etx = (char) 3;
            String msg = Character.toString(stx) + Character.toString(alloc) + "/" + Character.toString(lock)
                    + Character.toString(etx);
            session.sendMessage(new TextMessage(msg));
            KEYLIST.add(dev_id);
            CLIENTS.put(dev_id, session);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        for (int i = 0; i < KEYLIST.size(); i++) {
            if (CLIENTS.get(KEYLIST.get(i)) == session) {
                CLIENTS.remove(KEYLIST.get(i));
                KEYLIST.remove(KEYLIST.get(i));
                break;
            }
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        /*
         * String id = session.getId(); // 메시지를 보낸 아이디
         * CLIENTS.entrySet().forEach(arg -> {
         * if (!arg.getKey().equals(id)) { // 같은 아이디가 아니면 메시지를 전달합니다.
         * try {
         * arg.getValue().sendMessage(message);
         * } catch (IOException e) {
         * e.printStackTrace();
         * }
         * }
         * });
         */
    }

    private void sendMessage(String id, String msg) throws IOException {
        TextMessage message = new TextMessage(msg);
        CLIENTS.get(id).sendMessage(message);
    }

}
