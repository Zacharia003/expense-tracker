package com.expensetracker.dto;

import lombok.Data;

@Data
public class UserLoginRequest {
	private String identifier;
	private String username;
	private String password;
}
