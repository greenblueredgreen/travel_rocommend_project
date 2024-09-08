package com.travel.user.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.travel.user.domain.User;

@Mapper
public interface UserMapper {
	
	public List<User> selectUserList(int id);
}