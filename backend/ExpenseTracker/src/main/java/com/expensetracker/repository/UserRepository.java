package com.expensetracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.expensetracker.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{

	boolean existsByUsername(String username);
	
	boolean existsByEmailId(String emailId);
	
	boolean existsByMobileNumber(String mobileNumber);
}
