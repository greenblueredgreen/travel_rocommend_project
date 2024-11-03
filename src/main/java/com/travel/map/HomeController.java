package com.travel.map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travel.map.bo.LunchService;

@RestController
@CrossOrigin(origins = "http://localhost:3000") 
public class HomeController {
	
	@Autowired
    private LunchService lunchService; // LunchService 주입

    //카카오 API 키
    //@Value("${appkey.kakao}")
    private String appKey= "8323252951a97b41155cd927ab433d7c";

    //현재 위도에 해당하는 맛집 목록 들고오기.
    @GetMapping("/lunch")
    public String index(Model model) {
        String appKeyScript = "//dapi.kakao.com/v2/maps/sdk.js?appkey=" + appKey + "&libraries=services";
        model.addAttribute("appKey", appKeyScript);
       return "index.html";
    }

    @GetMapping("/test")
    public String mapTest() {
        return "map/map.html";
    }
}