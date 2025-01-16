package com.expensetracker.security;

import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {
	
	private Set<String> tokenBlacklist = new HashSet<>();

    // Invalidate the token by adding it to the blacklist
    public void invalidateToken(String token) {
        tokenBlacklist.add(token);
    }

    // Check if the token is blacklisted
    public boolean isTokenBlacklisted(String token) {
        return tokenBlacklist.contains(token);
    }

}
