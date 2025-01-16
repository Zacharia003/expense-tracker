package com.expensetracker.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expensetracker.dto.UserLoginRequest;
import com.expensetracker.model.Users;
import com.expensetracker.security.JwtTokenService;
import com.expensetracker.security.JwtUtil;
import com.expensetracker.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtTokenService jwtTokenService;

	@Autowired
	private JwtUtil jwtUtil;

	@PostMapping("/register")
	public ResponseEntity<String> registerUser(@RequestBody Users user) {
		if (isBlank(user.getFullName())) {
			return ResponseEntity.ok("Name field is blank");
		}

		if (isBlank(user.getUsername())) {
			return ResponseEntity.ok("Username field is blank");
		}

		if (isBlank(user.getEmailId())) {
			return ResponseEntity.ok("Email ID field is blank");
		}

		if (isBlank(user.getMobileNumber())) {
			return ResponseEntity.ok("Mobile Number field is blank");
		}

		if (isBlank(user.getPassword())) {
			return ResponseEntity.ok("Password field is blank");
		}

		String response = userService.registerUser(user);
		return ResponseEntity.ok(response);
	}

	private boolean isBlank(String str) {
		return str == null || str.trim().isEmpty();
	}

	@GetMapping("/check-email")
	public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
//		System.out.println("checkEmail api is called...");
		boolean isEmailExist = userService.isEmailUnique(email);

		return ResponseEntity.ok(isEmailExist);
	}

	@GetMapping("/check-username")
	public ResponseEntity<Boolean> checkUsername(@RequestParam String username) {
//		System.out.println("check-username API is called...");
		boolean isUsernameExist = userService.isUsernameExist(username);

		return ResponseEntity.ok(isUsernameExist);
	}

	@GetMapping("/check-mobileNumber")
	public ResponseEntity<Boolean> checkMobileNumber(@RequestParam String mobNum) {
//		System.out.println("check-mobileNumber API is called...");
		boolean isMobNumExist = userService.isMobileNumberExist(mobNum);

		return ResponseEntity.ok(isMobNumExist);
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody UserLoginRequest request) {
		try {
			System.out.println("Identifier: "+request.getIdentifier());
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword()));
			String token = jwtUtil.generateToken(request.getIdentifier());

			System.out.println("toekn: "+token);
			
			// get user details by username
			Users user = userService.findByUser(request.getIdentifier());
			
			System.out.println("User "+user);

			Map<String, Object> response = new HashMap<>();
			response.put("token", token);
			response.put("userid", user.getId());
			response.put("fullName", user.getFullName());
			response.put("emailId", user.getEmailId());
			response.put("mobileNumber", user.getMobileNumber());

			return ResponseEntity.ok(response);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid username or password"));
		}

	}

	@PostMapping("/logout")
	public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
		// Extract the token (remove 'Bearer ' prefix)
		String actualToken = token.replace("Bearer ", "");

		// Invalidate the token (e.g., add to a blacklist or invalidate in DB)
		jwtTokenService.invalidateToken(actualToken);

		return ResponseEntity.ok("Logout successful");
	}
}
