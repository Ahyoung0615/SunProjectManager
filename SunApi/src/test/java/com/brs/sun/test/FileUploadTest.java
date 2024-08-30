package com.brs.sun.test;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import jakarta.servlet.http.HttpServletRequest;

@SpringBootTest
public class FileUploadTest {

	@Autowired
	private HttpServletRequest req;
	
	@Test
	void filePath() {
		String path = req.getServletContext().getRealPath("/ocrImg");
		System.out.println("path: " + path) ;
	}
}
