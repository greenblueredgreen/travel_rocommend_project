package com.travel.test;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller 
public class Ex02Controller {
    @RequestMapping("/lesson01/ex02")
    public String ex02() {  
         // src/main/resources/templates/   {lesson01/ex02}   .html
        return "lesson01/ex02"; 
    }
}
