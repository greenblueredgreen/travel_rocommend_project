package com.travel.map.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
public class MapService {

    @Value("${naver.client.id}")
    private String clientId;

    @Value("${naver.client.secret}")
    private String clientSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> searchPlaces(String query) {
        String url = UriComponentsBuilder.fromHttpUrl("https://openapi.naver.com/v1/search/local.json")
            .queryParam("query", query)
            .queryParam("display", 5)
            .build(false)
            .encode(StandardCharsets.UTF_8)
            .toUriString();

        return makeApiRequest(url);
    }

    public Map<String, Object> getNearbyPlaces(double lat, double lng, String type) {
        String url = UriComponentsBuilder.fromHttpUrl("https://openapi.naver.com/v1/search/local.json")
            .queryParam("query", type)
            .queryParam("display", 5)
            .queryParam("latitude", lat)
            .queryParam("longitude", lng)
            .queryParam("radius", 1000)
            .build(false)
            .encode(StandardCharsets.UTF_8)
            .toUriString();

        return makeApiRequest(url);
    }

    private Map<String, Object> makeApiRequest(String url) {
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.set("X-Naver-Client-Id", clientId);
        headers.set("X-Naver-Client-Secret", clientSecret);

        org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>("parameters", headers);

        org.springframework.http.ResponseEntity<Map> response = restTemplate.exchange(
            url, org.springframework.http.HttpMethod.GET, entity, Map.class);

        return response.getBody();
    }
}