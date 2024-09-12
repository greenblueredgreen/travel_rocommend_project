package com.travel.user;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.travel.common.EncryptUtils;
import com.travel.user.bo.UserBO;
import com.travel.user.entity.UserEntity;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/user")
public class UserRestController {
	
	@Autowired
	private UserBO userBO;
	//주석 수정
	//주석 수정2
	
	// 회원가입
	@PostMapping("/sign-up")
	public Map<String, Object> signUp(
			@RequestParam("email") String loginId, @RequestParam("password") String password) {

		String hashedPassword = EncryptUtils.md5(password);

		// 해시값 저장
		UserEntity user = userBO.addUser(loginId, hashedPassword);

		Map<String, Object> result = new HashMap<>();
		if (user != null) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("result", "회원가입 실패");
		}
		return result;
	}

	// 로그인
	@PostMapping("/sign-in")
	public Map<String, Object> signIn(
			@RequestParam("email") String loginId,
			@RequestParam("password") String password, HttpServletRequest request) {

		// password 해싱
		String hashedPassword = EncryptUtils.md5(password);

		// DB 조회
		UserEntity user = userBO.getUserEntityByLoginIdPassword(loginId, hashedPassword);

		// 응답값
		Map<String, Object> result = new HashMap<>();
		if (user != null) {
			HttpSession session = request.getSession();
			session.setAttribute("userId", user.getId());
			session.setAttribute("userLoginId", user.getLoginId());
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 200);
			result.put("error_message", "회원가입을 먼저 해주세요. 가입되지 않은 사용자입니다.");
		}
		return result;
	}
}
