package com.expensetracker.security;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.expensetracker.model.Users;
import com.expensetracker.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	@Autowired
	private UserRepository userRepository;

//	@Override
//	public UserDetails loadUserByUsername(String identifier) {
//		// Fetch user from the database by username
////        Users user = userRepository.findByUsername(username)
////                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//		Users user = userRepository.findByUsernameOrEmailIdOrMobileNumber(identifier, identifier, identifier)
//				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//		// Return a UserDetails object containing user info
//		// Since we don't have roles, we return a default "ROLE_USER"
//		return new User(user.getUsername(), // Username
//				user.getPassword(), // Encoded password
//				true, // Account is enabled
//				true, // Credentials are not expired
//				true, // Account is not expired
//				true, // Account is not locked
//				Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")) // Default authority
//		);
//	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		return loadUserByIdentifier(username);
	}

	public UserDetails loadUserByIdentifier(String identifier) throws UsernameNotFoundException {
//		System.out.println("--> at loadUserByIdentifier() ");
		Users user = userRepository.findByUsernameOrEmailIdOrMobileNumber(identifier, identifier, identifier)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
		return new User(user.getUsername(), user.getPassword(), true, true, true, true,
				Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
	}

}
