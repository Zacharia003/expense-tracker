package com.expensetracker.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private CustomUserDetailsService userDetailsService;

	@Autowired
	private JwtTokenService jwtTokenService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
	        throws ServletException, IOException {

	    // Extract Authorization header
	    final String authHeader = request.getHeader("Authorization");

	    // Proceed only if the header exists and starts with 'Bearer '
	    if (authHeader != null && authHeader.startsWith("Bearer ")) {
	        String jwt = authHeader.substring(7); // Remove "Bearer " prefix

	        // Check if the token is blacklisted
	        if (jwtTokenService.isTokenBlacklisted(jwt)) {
	            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Respond with 401 Unauthorized
	            response.getWriter().write("Token is invalid or has been logged out.");
	            return; // Stop further processing
	        }

	        // Extract the identifier from the token
	        String identifier = jwtUtil.extractIdentifier(jwt);
	        System.out.println("Extracted Identifier: " + identifier); // Debug log

	        // Validate identifier and ensure no authentication exists in the current context
	        if (identifier != null && SecurityContextHolder.getContext().getAuthentication() == null) {
	            UserDetails userDetails = userDetailsService.loadUserByIdentifier(identifier);
	            System.out.println("User Details: " + userDetails); // Debug log
	            
	            // Validate the token against the user's identifier
	            if (jwtUtil.isTokenValid(jwt, identifier)) {
	                // Set authentication in the SecurityContext
	                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
	                        null, userDetails.getAuthorities());
	                SecurityContextHolder.getContext().setAuthentication(authToken);
	            }
	        }
	    }

	    // Proceed with the filter chain
	    filterChain.doFilter(request, response);
	}


}
