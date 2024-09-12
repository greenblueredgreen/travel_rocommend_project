package com.travel.post.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PostMapper {
	
	//글 생성 mapper
	public void insertPost(
			@Param("userId") int userId, 
			@Param("userLoginId") String userLoginId,
			@Param("subject") String subject, 
			@Param("content") String content);
}
