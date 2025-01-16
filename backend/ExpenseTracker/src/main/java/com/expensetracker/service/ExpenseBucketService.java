package com.expensetracker.service;

import java.util.List;

import com.expensetracker.dto.ApiResponse;
import com.expensetracker.dto.ExpenseBucketRequest;
import com.expensetracker.model.ExpenseBucket;

public interface ExpenseBucketService {
	ApiResponse<ExpenseBucket> createExpenseBucket(ExpenseBucketRequest request);
	List<ExpenseBucket> readAllExpBucket(Long id);
	ApiResponse<ExpenseBucket> updateExpenseBucket(Long userId, Long bucketId, ExpenseBucketRequest request);
	ApiResponse<Void> deleteExpBucket(Long id);
}
