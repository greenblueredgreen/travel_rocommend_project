package com.travel.map;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travel.map.bo.LunchService;

@RestController
@RequestMapping("/lunch")
@CrossOrigin(origins = "http://localhost:3000")
public class HomeRestController {

	@Autowired
	private LunchService lunchService; // LunchService 주입

	// 카카오 API 키
	private String appKey = "8323252951a97b41155cd927ab433d7c";

	// react로 보내는 post코드
	// 현재 위치 기반 맛집
	@PostMapping("/recommend")
	public ResponseEntity<String> getLunchRecommendations(@RequestBody Map<String, String> request) {
		String latitude = request.get("latitude");
		String longitude = request.get("longitude");
		String page = request.get("page");
		String appKey = "8323252951a97b41155cd927ab433d7c"; // Kakao API Key

		//알고보니 latitude와 longtiude 파라미터 위치가 바껴서 들어가 현재 위치 맛집이 출력이 안됨.
		//파라미터 순서에 주의해서 작성.
		return lunchService.getSearchLunchList(latitude, longitude, page, "15", appKey);
	}
	
	// 주소 검색 기반 맛집 추천
	@PostMapping("/recommend/findAddress")
	public ResponseEntity<String> getLunchRecommendationsByAddress(@RequestBody Map<String, String> request) {
		String latitude = request.get("latitude");
		String longitude = request.get("longitude");
		String page = request.get("page");
		String appKey = "8323252951a97b41155cd927ab433d7c"; // Kakao API Key

		//알고보니 latitude와 longtiude 파라미터 위치가 바껴서 들어가 현재 위치 맛집이 출력이 안됨.
		//파라미터 순서에 주의해서 작성.
		return lunchService.getSearchLunchList(latitude, longitude, page, "15", appKey);
	}
}