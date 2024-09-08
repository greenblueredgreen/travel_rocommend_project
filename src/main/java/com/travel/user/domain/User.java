package com.travel.user.domain;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.ToString;

@ToString
@Data
public class User {
	private int id;

	private String loginId;

	private String password;
	
	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

}
