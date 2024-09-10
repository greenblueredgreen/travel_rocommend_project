package com.travel.user.bo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travel.user.entity.UserEntity;
import com.travel.user.repository.UserRepository;

@Service
public class UserBO {

	@Autowired
	private UserRepository userRepository;

	// ID 중복확인 BO
	public UserEntity getUserEntityByLoginId(String loginId) {
		return userRepository.findByLoginId(loginId);
	}

	// 회원가입 BO
	public UserEntity addUser(String loginId, String password) {
		return userRepository.save(UserEntity.builder().loginId(loginId).password(password).build());
	}

	// 로그인 : 아이디, 비번 BO
	public UserEntity getUserEntityByLoginIdPassword(String loginId, String password) {
		return userRepository.findByLoginIdAndPassword(loginId, password);
	}

}
