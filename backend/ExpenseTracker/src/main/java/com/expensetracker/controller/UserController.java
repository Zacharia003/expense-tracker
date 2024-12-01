package com.expensetracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.expensetracker.model.User;
import com.expensetracker.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@PostMapping("/register")
	public ResponseEntity<String> registerUser(@RequestBody User user){
		System.out.println("-> in controller...");
		String response = userService.registerUser(user);
		
		if(response.equals("User Registered Succussfully!")) {
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		}
		
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}
}
