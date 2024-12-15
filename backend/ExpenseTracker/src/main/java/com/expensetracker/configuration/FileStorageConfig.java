package com.expensetracker.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FileStorageConfig {
	
	@Value("${file.storage.base-path}")
	private String basePath;
	
	public String getBasePath() {
		return basePath;
	}
}
