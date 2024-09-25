package com.travel.post;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.travel.post.bo.PostBO;
import com.travel.post.domain.Post;

@RestController
@RequestMapping("/post")
public class PostController {
	
	@Autowired
	private PostBO postBO;
	
	// 글 가져오는 RestController
	@GetMapping("/api/post-list")
	public List<Post> postListView() {
		
		// db조회 - 글목록
		List<Post> postList = postBO.getPostList();

		return postList;
	}
}
