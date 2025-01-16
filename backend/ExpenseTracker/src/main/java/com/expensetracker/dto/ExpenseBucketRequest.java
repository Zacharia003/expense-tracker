package com.expensetracker.dto;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class ExpenseBucketRequest {
	private String bucketName;
	private String description;
	private String tag;
	private Long userId;	
}
