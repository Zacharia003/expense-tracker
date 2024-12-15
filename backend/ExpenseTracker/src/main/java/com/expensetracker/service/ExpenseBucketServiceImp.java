package com.expensetracker.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expensetracker.dto.ExpenseBucketRequest;
import com.expensetracker.model.ExpenseBucket;
import com.expensetracker.model.User;
import com.expensetracker.repository.ExpenseBucketRepository;
import com.expensetracker.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class ExpenseBucketServiceImp implements ExpenseBucketService {

	@Autowired
	private ExpenseBucketRepository expBucketRepository;

	@Autowired
	private UserRepository userRepo;

	@Autowired
	FileStorageService fileStorageService;

	//create new expense bucket
	@Override
	public String createExpenseBucket(ExpenseBucketRequest request) {
		if(request.getBucketName().isEmpty()) {
			return "Please give name to Expense Bucket!";
		}
		
		Optional<User> userOptional = userRepo.findById(request.getUserId());

		if (userOptional.isEmpty()) {
			return "User not found";
		}

		User user = userOptional.get();

		System.out.println(user);

		// Check if the bucket name already exists for the user
		if (expBucketRepository.existsByBucketNameAndUser(request.getBucketName(), user)) {
			return "Expense Bucket already exists";
		}

		// Create and save the new ExpenseBucket
		ExpenseBucket expenseBucket = new ExpenseBucket();
		expenseBucket.setBucketName(request.getBucketName());
		expenseBucket.setDiscription(request.getDiscription());
		expenseBucket.setTag(request.getTag());
		expenseBucket.setUser(user);

		fileStorageService.createExpBucketFolder(user.getUserFolder(), request.getBucketName());

		return expBucketRepository.save(expenseBucket) != null ? "Expense Bucket Created!" : "Failed to Create!";
	}

	
	//get all expense bucket for userId
	public List<ExpenseBucket> readAllExpBucket(Long userId) {
		
		return expBucketRepository.findAllByUserId(userId);
	}
	
	@Override
	@Transactional
	public String updateExpenseBucket(Long userId, Long bucketId, ExpenseBucketRequest request) {

		// check if user exist
		Optional<User> userOptional = userRepo.findById(userId);

		if (userOptional.isEmpty()) {
			return "User not found";
		}

		User user = userOptional.get();

		// find expense_bucket by ID and validate it belong to userID?
		Optional<ExpenseBucket> expBucketOptional = expBucketRepository.findById(bucketId);

		if (expBucketOptional.isEmpty()) {
			return "Expense bucket not found!";
		}

		ExpenseBucket expenseBucket = expBucketOptional.get();

		if (!user.getId().equals(expenseBucket.getUser().getId())) {
			return "This expense bucket does not belong to the user";
		}

		// update field if provided
		if (request.getBucketName() != null && !request.getBucketName().isBlank()) {
			expenseBucket.setBucketName(request.getBucketName());
		}

		if (request.getDiscription() != null && !request.getDiscription().isBlank()) {
			expenseBucket.setDiscription(request.getDiscription());
		}

		if (request.getTag() != null && !request.getTag().isBlank()) {
			expenseBucket.setTag(request.getTag());
		}

		// update created_at timestamp
		expenseBucket.setCreatedAt(LocalDateTime.now());

//		System.out.println("user Id"+expenseBucket.getUser());

		return expBucketRepository.save(expenseBucket) != null ? "Updated!" : "Fail to update!";
	}

	public String deleteExpBucket(Long id) {
		Optional<ExpenseBucket> expBucketOptional = expBucketRepository.findById(id);

		if (expBucketOptional.isEmpty()) {
			return "Expense Bucket Not Found!";
		}

		ExpenseBucket expenseBucket = expBucketOptional.get();

		expBucketRepository.delete(expenseBucket);

		return "Expense Bucket Delete Successfully!";
	}
}
