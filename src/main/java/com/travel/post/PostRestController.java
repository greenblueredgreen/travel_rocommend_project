package com.travel.post;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.travel.post.bo.PostBO;

import jakarta.servlet.http.HttpSession;

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
	
	//글 삭제 
	@DeleteMapping("/delete")
	public Map<String, Object> delete(
			@RequestParam("postId") int postId){
		
		//DB delete - 글번호와 글쓴이 번호로 삭제 
		postBO.deletePostByPostId(postId);
		
		//응답값
		Map<String, Object> result = new HashMap<>();
		result.put("code", 200);
		result.put("result", "성공");
		
		return result;
	}
}