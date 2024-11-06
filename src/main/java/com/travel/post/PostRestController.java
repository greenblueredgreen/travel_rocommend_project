package com.travel.post;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.travel.post.bo.PostBO;

@RequestMapping("/post")
@RestController
public class PostRestController {
	
	@Autowired
	private PostBO postBO;
	
	//글 생성 api
	@PostMapping("/create")
	public Map<String, Object> create(
			@RequestParam("subject") String subject,
			@RequestParam("content") String content, 
			@RequestParam("email") String email,
			@RequestParam("startDate") String startDate,
			@RequestParam("endDate") String endDate) {

		String userLoginId = email;
		int userId = 1;
		
		// DB insert
		// 글쓴이 번호, 로그인 id, 제목, 글내용
		postBO.addPost(userId, userLoginId, subject, content, startDate, endDate);
		
		// 응답값
		Map<String, Object> result = new HashMap<>();
		result.put("code", 200);
		result.put("result", "성공");
		
		return result;
	}
	
	//글 삭제 api
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
	
	
	//글 수정 api
	@PutMapping("/update")
	public Map<String, Object> update(
			@RequestParam("postId") int postId,
			@RequestParam("subject") String subject,
			@RequestParam("content") String content,
			@RequestParam("startDate") String startDate,
			@RequestParam("endDate") String endDate){
		
		//db update
		postBO.updatePostByPostId(postId, subject, content, startDate, endDate);

		//응답값
		Map<String, Object> result = new HashMap<>();
		result.put("code", 200);
		result.put("result", "성공");
		
		return result;
	}
	
}