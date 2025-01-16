package com.expensetracker.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expensetracker.dto.ApiResponse;
import com.expensetracker.dto.ExpenseBucketRequest;
import com.expensetracker.model.ExpenseBucket;
import com.expensetracker.model.Users;
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

	// create new expense bucket
	@Override
	public ApiResponse<ExpenseBucket> createExpenseBucket(ExpenseBucketRequest request) {
		if (request.getBucketName().isEmpty()) {
			return new ApiResponse<>("400", "Please give name to Expense Bucket!", null);
		}
		Optional<Users> userOptional = userRepo.findById(request.getUserId());
		if (userOptional.isEmpty()) {
			return new ApiResponse<>("404", "User not found", null);
		}
		Users user = userOptional.get();
		if (expBucketRepository.existsByBucketNameAndUser(request.getBucketName(), user)) {
			return new ApiResponse<>("409", "Expense Bucket already exists", null);
		}
		ExpenseBucket expenseBucket = new ExpenseBucket();
		expenseBucket.setBucketName(request.getBucketName());
		expenseBucket.setDescription(request.getDescription());
		expenseBucket.setTag(request.getTag());
		expenseBucket.setUser(user);
		fileStorageService.createExpBucketFolder(user.getUserFolder(), request.getBucketName());
		ExpenseBucket savedBucket = expBucketRepository.save(expenseBucket);
		return new ApiResponse<>("201", "Expense Bucket Created!", savedBucket);
	}

	// get all expense bucket for userId
	public List<ExpenseBucket> readAllExpBucket(Long userId) {

		return expBucketRepository.findAllByUserId(userId);
	}

	@Override
	@Transactional
	public ApiResponse<ExpenseBucket> updateExpenseBucket(Long userId, Long bucketId, ExpenseBucketRequest request) {
		// Check if user exists
		Optional<Users> userOptional = userRepo.findById(userId);
		if (userOptional.isEmpty()) {
			return new ApiResponse<>("404", "User not found", null);
		}
		Users user = userOptional.get();
		// Find expense_bucket by ID and validate it belongs to userID
		Optional<ExpenseBucket> expBucketOptional = expBucketRepository.findById(bucketId);
		if (expBucketOptional.isEmpty()) {
			return new ApiResponse<>("404", "Expense bucket not found!", null);
		}
		ExpenseBucket expenseBucket = expBucketOptional.get();
		if (!user.getId().equals(expenseBucket.getUser().getId())) {
			return new ApiResponse<>("400", "This expense bucket does not belong to the user", null);
		}
		// Update fields if provided
		if (request.getBucketName() != null && !request.getBucketName().isBlank()) {
			expenseBucket.setBucketName(request.getBucketName());
		}
		if (request.getDescription() != null) {
			expenseBucket.setDescription(request.getDescription());
		}
		if (request.getTag() != null) {
			expenseBucket.setTag(request.getTag());
		}
		// Update created_at timestamp
		expenseBucket.setCreatedAt(LocalDateTime.now());
		ExpenseBucket updatedBucket = expBucketRepository.save(expenseBucket);
		return updatedBucket != null ? new ApiResponse<>("200", "Updated!", updatedBucket)
				: new ApiResponse<>("400", "Fail to update!", null);
	}

	public ApiResponse<Void> deleteExpBucket(Long id) {

		Optional<ExpenseBucket> expenseBucketOptional = expBucketRepository.findById(id);

		if (expenseBucketOptional.isPresent()) {
			ExpenseBucket expenseBucket = expenseBucketOptional.get();
			Optional<Users> usersOptional = userRepo.findById(expenseBucket.getUser().getId());

			if (usersOptional.isPresent()) {
				Users user = usersOptional.get();

				// call delete expense folder from storage
				fileStorageService.deleteExpBucketFolder(user.getUserFolder(), expenseBucket.getBucketName());
				expBucketRepository.deleteById(id);
				return new ApiResponse<>("200", "Expense Bucket Deleted!", null);
			} else {
				return new ApiResponse<>("404", "User not found", null);
			}

		} else {
			return new ApiResponse<>("404", "Expense Bucket not found", null);
		}
	}
}
