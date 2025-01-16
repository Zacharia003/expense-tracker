package com.expensetracker.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

@Data
@ToString(exclude = "expenseBuckets")
@Entity
@Table(name = "user")
public class Users {
	
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
	
	@Column(nullable = true, length = 255)
	private String password;
	
	@Column(nullable = true)
    private String userFolder;
	
	@Column(name = "date_of_registeration", nullable = false, updatable = false)
	private LocalDateTime dateOfRegisteration = LocalDateTime.now();
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ExpenseBucket> expenseBuckets;
	
}
