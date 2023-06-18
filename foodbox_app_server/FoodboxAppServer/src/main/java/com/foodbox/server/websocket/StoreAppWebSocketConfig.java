package com.foodbox.server.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class StoreAppWebSocketConfig implements WebSocketConfigurer {
    private final StoreAppWebSocketHandler webSocketHandler;

    public StoreAppWebSocketConfig(StoreAppWebSocketHandler webSocketHandler) {
        this.webSocketHandler = webSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketHandler, "/websocket/store")
        		.setAllowedOrigins("*");
    }
}