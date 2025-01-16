package com.expensetracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.expensetracker.model.ExpenseBucket;
import com.expensetracker.model.Users;

public interface ExpenseBucketRepository extends JpaRepository<ExpenseBucket, Long>{
	boolean existsByBucketNameAndUser(String bucketName, Users user);
	
	List<ExpenseBucket> findAllByUserId(Long userId);
}
