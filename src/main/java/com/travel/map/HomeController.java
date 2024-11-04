package com.travel.map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
	
	//카카오 API 키
    //@Value("${appkey.kakao}")
    private String appKey= "8323252951a97b41155cd927ab433d7c";

    //현재 위도에 해당하는 맛집 목록 들고오기.
    //html로 이동하는 getMapping코드
    @GetMapping("/html")
    public String index(Model model) {
        String appKeyScript = "//dapi.kakao.com/v2/maps/sdk.js?appkey=" + appKey + "&libraries=services";
        model.addAttribute("appKey", appKeyScript);
       return "index.html";
    }
}
