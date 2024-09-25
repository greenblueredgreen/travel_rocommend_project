package com.travel.post.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.travel.post.domain.Post;

@Mapper
public interface PostMapper {
	
	//글 생성 mapper
	public void insertPost(
			@Param("userId") int userId, 
			@Param("userLoginId") String userLoginId,
			@Param("subject") String subject, 
			@Param("content") String content);
	
	//글 리스트 들고오는 mapper
	public List<Post> selectPostList();
}
