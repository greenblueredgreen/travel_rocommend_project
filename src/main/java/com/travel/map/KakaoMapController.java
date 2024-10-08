package com.travel.map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@CrossOrigin(origins = "*")
@RestController
public class KakaoMapController {

//    @Value("${kakao.api.key}")
//    private String kakaoApiKey;
//
//    private final String KAKAO_MAP_URL = "https://dapi.kakao.com/v2/local/search/keyword.json";
//
//    private final RestTemplate restTemplate;
//
//    // Constructor injection
//    public KakaoMapController(RestTemplate restTemplate) {
//        this.restTemplate = restTemplate;
//    }
//
//    @GetMapping("/api/map/search")
//    public ResponseEntity<String> searchMap(@RequestParam String query) {
//        String url = KAKAO_MAP_URL + "?query=" + query;
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Authorization", "KakaoAK " + kakaoApiKey);
//
//        HttpEntity<String> entity = new HttpEntity<>(headers);
//        
//        try {
//            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
//            
//            if (response.getStatusCode().is2xxSuccessful()) {
//                return ResponseEntity.ok(response.getBody());
//            } else {
//                return ResponseEntity.status(response.getStatusCode()).body("Error: " + response.getBody());
//            }
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
//        }
//    }
}