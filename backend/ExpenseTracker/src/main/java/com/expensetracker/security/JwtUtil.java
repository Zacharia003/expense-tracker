package com.expensetracker.security;

import java.util.Date;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.SignatureException;

@Component
public class JwtUtil {

	@Value("${jwt.secret}")
	private String SECRET_KEY;
	
	

	public String generateToken(String identifier) {
		SecretKey key = new SecretKeySpec(SECRET_KEY.getBytes(), SignatureAlgorithm.HS256.getJcaName());

		return Jwts.builder().claim("sub", identifier) // "sub" is the JWT standard claim for 'subject'
				.claim("iat", new Date(System.currentTimeMillis())) // Issued at
				.claim("exp", new Date(System.currentTimeMillis() + (30L * 24 * 60 * 60 * 1000))) // 30 days expiration
				.signWith(key, SignatureAlgorithm.HS256) // Sign using the SecretKey
				.compact();
	}

	public Claims validateToken(String token) {
		try {
			SecretKey key = new SecretKeySpec(SECRET_KEY.getBytes(), "HmacSHA256");

			return Jwts.parserBuilder() // Use the parserBuilder() method
					.setSigningKey(key) // Set the signing key here
					.build().parseClaimsJws(token) // Parses and validates the token
					.getBody(); // Get the payload (claims)

		} catch (SignatureException ex) {
			throw new RuntimeException("Invalid JWT signature", ex);
		} catch (Exception ex) {
			throw new RuntimeException("Token validation failed", ex);
		}
	}

	//Extracts the identifier (subject) from the JWT token
	public String extractIdentifier(String token) {
		return validateToken(token).getSubject();
	}
	
	//Checks if the token is valid
	public boolean isTokenValid(String token, String identifier) {
        String extractedIdentifier = extractIdentifier(token);
        return (identifier.equals(extractedIdentifier) && !isTokenExpired(token));
    }
	//Checks if the token is expired
	public boolean isTokenExpired(String token) {
        Date expiration = extractExpiration(token);
        return expiration.before(new Date());
    }
	
	//Extracts the expiration date from the JWT token
	public Date extractExpiration(String token) {
        return validateToken(token).getExpiration();
    }
	
	
}
