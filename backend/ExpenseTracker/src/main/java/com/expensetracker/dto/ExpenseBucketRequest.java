package com.expensetracker.dto;

import lombok.Data;

@Data
public class ExpenseBucketRequest {
	private String bucketName;
	private String discription;
	private String tag;
	private Long userId;	
}
