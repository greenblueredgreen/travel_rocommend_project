package com.travel.test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class TestController {
  @ResponseBody
    @RequestMapping("/test1")
    public String helloWorld() {
        return "Hello world!";
    }
  
  @ResponseBody
	@GetMapping("/test2")
	public Map<String, Object> test2(){
		Map<String, Object> map = new HashMap<>();
		map.put("a", 1111);
		map.put("b", 1112);
		map.put("c", 1113);
		return map;
	}
}

