package com.expensetracker.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "user")
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "full_name", nullable = false, length = 50)
	private String fullName;
	
	@Column(nullable = false, unique = true, length = 15)
	private String username;
	
	@Column(nullable = false, unique = true, length = 50)
	private String emailId;
	
	@Column(name="mobile_number", nullable = false, unique = true, length = 15)
	private String mobileNumber;
	
	@Column(nullable = false, length = 255)
	private String password;
	
	@Column(name = "date_of_registeration", nullable = false, updatable = false)
	private LocalDateTime dateOfRegisteration = LocalDateTime.now();

	@Override
	public String toString() {
		return "User [id=" + id + ", fullName=" + fullName + ", username=" + username + ", emailId=" + emailId
				+ ", mobileNumber=" + mobileNumber + ", password=" + password + ", dateOfRegisteration="
				+ dateOfRegisteration + "]";
	}
	
	
}
