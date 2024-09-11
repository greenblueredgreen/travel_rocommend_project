package com.travel.map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/maps")
public class NaverMapsController {

    @Value("${naver.cloud.maps.client-id}")
    private String clientId;

    @GetMapping("/config")
    public MapConfig getMapConfig() {
        return new MapConfig(clientId);
    }

    private static class MapConfig {
        private final String clientId;

        MapConfig(String clientId) {
            this.clientId = clientId;
        }

        public String getClientId() {
            return clientId;
        }
    }
}