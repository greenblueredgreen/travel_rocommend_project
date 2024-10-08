package com.travel.map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

import com.travel.map.bo.LunchService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class LunchController {

    private final LunchService lunchService;

    // 카카오 API 키 (application.properties 설정)
    //@Value("${apikey.kakao}")
    private String apiKey = "8323252951a97b41155cd927ab433d7c";

    /**
     * 음식점 추천 List Post 요청
     * @param request 요청 데이터
     * @return ResponseEntity
     */
    @PostMapping("/lunch")
    private ResponseEntity<String> searchLunch(HttpServletRequest request) {
        String latitude = request.getParameter("latitude");
        String longitude = request.getParameter("longitude");
        String page = request.getParameter("page");

        return lunchService.getSearchLunchList(latitude, longitude, page, "15", apiKey);
    }

    @PutMapping("/lunch")
    private ResponseEntity<String> updateLunch() {
        return ResponseEntity.status(HttpStatus.OK).body("PutMapping!!");
    }

    @DeleteMapping("lunch")
    private ResponseEntity<String> deleteLunch() {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("DeleteMapping!!");
    }

}
