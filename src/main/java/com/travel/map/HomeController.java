package com.travel.map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import lombok.Value;

@Controller
public class HomeController {

    // 카카오 API 키 (application.properties 설정)
    //@Value("${appkey.kakao}")
    private String appKey= "8323252951a97b41155cd927ab433d7c";

    @GetMapping("/")
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