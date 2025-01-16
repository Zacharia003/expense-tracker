package com.expensetracker.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.expensetracker.model.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, Long>{

	boolean existsByUsername(String username);
	
	boolean existsByEmailId(String emailId);
	
	boolean existsByMobileNumber(String mobileNumber);
	
	Optional<Users> findByUsername(String username);
	
	Optional<Users> findByUsernameOrEmailIdOrMobileNumber(String username, String emailId, String mobileNumber);
}
