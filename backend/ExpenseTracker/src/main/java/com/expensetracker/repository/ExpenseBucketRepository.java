package com.expensetracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.expensetracker.model.ExpenseBucket;
import com.expensetracker.model.User;

public interface ExpenseBucketRepository extends JpaRepository<ExpenseBucket, Long>{
	boolean existsByBucketNameAndUser(String bucketName, User user);
	
	List<ExpenseBucket> findAllByUserId(Long userId);
}
