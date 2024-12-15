package com.expensetracker.service;

import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.expensetracker.configuration.FileStorageConfig;

@Service
public class FileStorageService {

	@Autowired
	private FileStorageConfig fileStorageConfig;

	// create folder for expense bucket
	public void createExpBucketFolder(String userFolder, String expenseBucket) {
		String basePath = fileStorageConfig.getBasePath();

		File userDir = new File(basePath + userFolder+"//"+expenseBucket);

		if (!userDir.exists()) {
			userDir.mkdirs();
		}
	}
}
