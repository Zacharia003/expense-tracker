package com.expensetracker.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.expensetracker.dto.ApiResponse;
import com.expensetracker.dto.ExpenseBucketRequest;
import com.expensetracker.model.ExpenseBucket;
import com.expensetracker.service.ExpenseBucketService;

@RestController
@RequestMapping("/api/expense-buckets")
public class ExpenseBucketController {

	@Autowired
	private ExpenseBucketService expBucketService;

	@PostMapping("/addNewBucket")
	public ResponseEntity<ApiResponse<ExpenseBucket>> createExpBucket(@RequestBody ExpenseBucketRequest request) {
		ApiResponse<ExpenseBucket> response = expBucketService.createExpenseBucket(request);

		switch (response.getStatus()) {
		case "201":
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		case "400":
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		case "404":
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		case "409":
			return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
		default:
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
		}
	}

	@GetMapping("/getAllExpeseBuckets/{id}")
	public ResponseEntity<ApiResponse<List<ExpenseBucket>>> readAllExpBucket(@PathVariable Long id) {
		List<ExpenseBucket> expenseBuckets = expBucketService.readAllExpBucket(id);

		ApiResponse<List<ExpenseBucket>> response;
		if (!expenseBuckets.isEmpty()) {
			response = new ApiResponse<>("200", "Data found", expenseBuckets);
			return ResponseEntity.ok(response);
		} else {
			response = new ApiResponse<>("404", "No data found", Collections.emptyList());
			return ResponseEntity.ok(response); // Or use ResponseEntity.status(HttpStatus.NOT_FOUND)
		}
	}

	// update expense_bucket name/tag/description
	@PatchMapping("/updateExpBucketDetails/{id}")
	public ResponseEntity<ApiResponse<ExpenseBucket>> updateExpBucket(@PathVariable Long id, @RequestParam Long userId,
			@Validated @RequestBody ExpenseBucketRequest request) {
		
		System.out.println("---> ExpBucketId: "+id);
		System.out.println("---> UserId: "+userId);
		System.out.println("---> payload: "+request);

		ApiResponse<ExpenseBucket> response = expBucketService.updateExpenseBucket(userId, id, request);
		if (response.getStatus().equals("200")) {
			return ResponseEntity.ok(response);
		} else if (response.getStatus().equals("404")) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}
	}

	// API to Delete Expense Bucket
	@DeleteMapping("/deleteBucket")
	public ResponseEntity<ApiResponse<Void>> deleteBucket(@RequestParam Long id) {
		ApiResponse<Void> response = expBucketService.deleteExpBucket(id);

		if (response.getStatus().equals("200")) {
			return ResponseEntity.ok(response);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		}
	}

}
