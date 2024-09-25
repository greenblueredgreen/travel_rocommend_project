package com.travel.post;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.travel.post.bo.PostBO;
import com.travel.post.domain.Post;

@RequestMapping("/post")
@RestController
public class PostRestController {
	
	@Autowired
	private PostBO postBO;
	
	//글 생성 
	@PostMapping("/create")
	public Map<String, Object> create(
			@RequestParam("subject") String subject,
			@RequestParam("content") String content, 
			@RequestParam("email") String email) {

		// 글쓴이 번호를 session에서 꺼낸다.
		//int userId = (int)session.getAttribute("userId");
		String userLoginId = email;
		int userId = 1;
	
		// DB insert
		// 글쓴이 번호, 로그인 id, 제목, 글내용, 첨부파일
		postBO.addPost(userId, userLoginId, subject, content);
		
		// 응답값
		Map<String, Object> result = new HashMap<>();
		result.put("code", 200);
		result.put("result", "성공");
		
		return result;
	}
}