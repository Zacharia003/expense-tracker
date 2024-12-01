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
		
		if(userRepository.existsByUsername(user.getUsername())) {
			return "Username already exist";
		}
		
		if(userRepository.existsByEmailId(user.getEmailId())) {
			return "Email ID already exist";
		}
		
		if(userRepository.existsByMobileNumber(user.getMobileNumber())) {
			return "Mobile Number already exist";
		}
		
		//Hash the password for security
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		userRepository.save(user);
		
		return "User Registered Succussfully!";
	}
}
