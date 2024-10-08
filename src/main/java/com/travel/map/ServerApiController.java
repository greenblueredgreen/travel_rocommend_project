package com.travel.map;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
 
import java.net.URI;
import java.nio.charset.Charset;
 
@Slf4j
@RestController
@RequestMapping("/api")
public class ServerApiController {
 
    // https://openapi.naver.com/v1/search/local.json?
    // query=%EC%A3%BC%EC%8B%9D&display=10&
    // start=1&
    // sort=random
 
    @GetMapping("/naver")
    public String naver(){
 
        //String query = "갈비집";
        //String encode = Base64.getEncoder().encodeToString(query.getBytes(StandardCharsets.UTF_8));
 
        URI uri = UriComponentsBuilder
                .fromUriString("https://openapi.naver.com")
                .path("/v1/search/local.json")
                .queryParam("query","중국집")
                .queryParam("display",10)
                .queryParam("start",1)
                .queryParam("sort","random")
                .encode(Charset.forName("UTF-8"))
                .encode()
                .build()
                .toUri();
 
        RequestEntity<Void> req = (RequestEntity<Void>) RequestEntity
                .get(uri)
                .header("X-Naver-Client-Id","dEVWKzHie72rc3C3qM3n")
                .header("X-Naver-Client-Secret","CX2FRtLmsy")
                .build();
 
        //주소 로그 확인
        log.info("uri : {}",uri);
 
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> result = restTemplate.exchange(req, String.class);
        return result.getBody();
    }
 
}
