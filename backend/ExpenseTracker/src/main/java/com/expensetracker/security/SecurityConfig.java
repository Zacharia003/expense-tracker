package com.expensetracker.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	//permit for only registration api

//	@Bean
//	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//            .csrf(csrf -> csrf.disable()) // Disable CSRF using the new lambda syntax
//            .authorizeHttpRequests(auth -> auth
//            		.requestMatchers("/api/users/register").permitAll() // Allow unrestricted access to all endpoints
//            		.anyRequest().authenticated() 
//            )
//            .httpBasic(Customizer.withDefaults()) // Disable HTTP Basic Authentication
//            .formLogin(Customizer.withDefaults()); // Disable Form-Based Authentication
//        
//        return http.build();
//    }
	
	//permit for all api
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF using the new lambda syntax
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Allow unrestricted access to all endpoints
            )
            .httpBasic(Customizer.withDefaults()) // Disable HTTP Basic Authentication
            .formLogin(Customizer.withDefaults()); // Disable Form-Based Authentication
        
        return http.build();
    }
}
