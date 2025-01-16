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
	
	//delete expense bucket folder from the storage
	public void deleteExpBucketFolder(String userFolder, String expenseBucket) {
	    String basePath = fileStorageConfig.getBasePath();

	    File bucketDir = new File(basePath + userFolder + "//" + expenseBucket);

	    if (bucketDir.exists()) {
	        deleteDirectory(bucketDir);
	    }
	}

	private void deleteDirectory(File directory) {
	    if (directory.isDirectory()) {
	        File[] files = directory.listFiles();
	        if (files != null) {
	            for (File file : files) {
	                deleteDirectory(file);
	            }
	        }
	    }
	    directory.delete();
	}

	
	
}
