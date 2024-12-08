package com.expensetracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;
	
	private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	
	public String registerUser(User user) {
		System.out.println("-> in Service....");
		
		try {
			user.setPassword(passwordEncoder.encode(user.getPassword()));
			userRepository.save(user);
			return "User Registered Succussfully!";
		} catch (Exception e) {
			return e.getMessage();
		}
	}
	
	public boolean isEmailUnique(String email) {
		return !userRepository.existsByEmailId(email);
	}
	
	public boolean isUsernameExist(String username) {
		return !userRepository.existsByUsername(username);
	}
	
	public boolean isMobileNumberExist(String mobileNumber){
		return !userRepository.existsByMobileNumber(mobileNumber);
	}
}
