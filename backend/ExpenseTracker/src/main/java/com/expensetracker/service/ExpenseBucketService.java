package com.expensetracker.service;

import java.util.List;

import com.expensetracker.dto.ExpenseBucketRequest;
import com.expensetracker.model.ExpenseBucket;

public interface ExpenseBucketService {
	String createExpenseBucket(ExpenseBucketRequest request);
	List<ExpenseBucket> readAllExpBucket(Long id);
	String updateExpenseBucket(Long userId, Long bucketId, ExpenseBucketRequest request);
	String deleteExpBucket(Long id);
}
