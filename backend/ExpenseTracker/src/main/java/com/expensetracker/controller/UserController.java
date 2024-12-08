package com.expensetracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expensetracker.model.User;
import com.expensetracker.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@PostMapping("/register")
	public ResponseEntity<String> registerUser(@RequestBody User user){
//		System.out.println("-> in controller...");
//		System.out.println(user);
		String response = userService.registerUser(user);
		
		return ResponseEntity.ok(response);
	}
	
	@GetMapping("/check-email")
	public ResponseEntity<Boolean> checkEmail(@RequestParam String email){
//		System.out.println("checkEmail api is called...");
		boolean isEmailExist = userService.isEmailUnique(email);
		
		return ResponseEntity.ok(isEmailExist);
	}
	
	@GetMapping("/check-username")
	public ResponseEntity<Boolean> checkUsername(@RequestParam String username){
//		System.out.println("check-username API is called...");
		boolean isUsernameExist = userService.isUsernameExist(username);
		
		return ResponseEntity.ok(isUsernameExist);
	}
	
	@GetMapping("/check-mobileNumber")
	public ResponseEntity<Boolean> checkMobileNumber(@RequestParam String mobNum){
//		System.out.println("check-mobileNumber API is called...");
		boolean isMobNumExist = userService.isMobileNumberExist(mobNum);
		
		return ResponseEntity.ok(isMobNumExist);
	}
}
