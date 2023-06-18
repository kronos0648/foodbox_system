package com.example.iot_hub.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class DeviceWebSocketConfiguration implements WebSocketConfigurer {

    private final DeviceWebSocketHandler webSocketHandler;

    public DeviceWebSocketConfiguration(DeviceWebSocketHandler webSocketHandler) {
        this.webSocketHandler = webSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketHandler, "/device").setAllowedOrigins("*");
    }

}
