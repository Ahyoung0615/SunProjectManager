package com.brs.sun.test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.brs.sun.model.service.TestService;

@SpringBootTest
class ServiceTest {

	@Autowired
	private TestService service;
	
	@Test
	void test() {
		String test = service.aopTest();
		assertNotNull(service);
	}

}
