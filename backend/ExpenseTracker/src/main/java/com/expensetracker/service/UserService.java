package com.expensetracker.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.expensetracker.model.Users;
import com.expensetracker.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	public String registerUser(Users user) {
//		System.out.println("-> in Service....");

		try {
			user.setPassword(passwordEncoder.encode(user.getPassword()));
			Users savedUser = userRepository.save(user);

			// Set the userFolder using the generated ID
			savedUser.setUserFolder(savedUser.getUsername() + savedUser.getId());

			// Save the updated user back to the database
			userRepository.save(savedUser);

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

	public boolean isMobileNumberExist(String mobileNumber) {
		return !userRepository.existsByMobileNumber(mobileNumber);
	}

	public Users findByUser(String identifier) {

		return userRepository.findByUsernameOrEmailIdOrMobileNumber(identifier, identifier, identifier)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
	}
}
