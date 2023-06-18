package com.foodbox.server.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class ConsumerAppWebSocketConfig implements WebSocketConfigurer {
    private final ConsumerAppWebSocketHandler webSocketHandler;

    public ConsumerAppWebSocketConfig(ConsumerAppWebSocketHandler webSocketHandler) {
        this.webSocketHandler = webSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketHandler, "/websocket/consumer")
        		.setAllowedOrigins("*");
    }
}