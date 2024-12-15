package com.expensetracker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.expensetracker.dto.ExpenseBucketRequest;
import com.expensetracker.model.ExpenseBucket;
import com.expensetracker.service.ExpenseBucketService;

import jakarta.persistence.Id;

@RestController
@RequestMapping("/api/expense-buckets")
public class ExpenseBucketController {

	@Autowired
	private ExpenseBucketService expBucketService;

	@PostMapping("/add")
	public ResponseEntity<String> createExpBucket(@RequestBody ExpenseBucketRequest request) {
		String status = expBucketService.createExpenseBucket(request);
		return ResponseEntity.ok(status);
	}

	@GetMapping("/getAllExpeseBuckets/{id}")
	public ResponseEntity<?> readAllExpBucket(@PathVariable Long id) {
		List<ExpenseBucket> expenseBuckets = expBucketService.readAllExpBucket(id);

		if (!expenseBuckets.isEmpty()) {
			return ResponseEntity.ok(expenseBuckets);
		} else {
			return ResponseEntity.ok("No Data found!");
		}
	}

	// update expense_bucket name/tag/description
	@PatchMapping("/update/{id}")
	public ResponseEntity<String> updateExpBucket(@PathVariable Long id, @RequestParam Long userId,
			@Validated @RequestBody ExpenseBucketRequest request) {

//		System.out.println("---> in updateExpBucket api bucket id :"+id+" userId:"+userId+" \nPayload:"+request.toString());

		String response = expBucketService.updateExpenseBucket(userId, id, request);

		return ResponseEntity.ok(response);
	}

	// delete expense_bucket
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteBucket(@PathVariable Long id) {
		String reponse = expBucketService.deleteExpBucket(id);

		return ResponseEntity.ok(reponse);
	}
}
