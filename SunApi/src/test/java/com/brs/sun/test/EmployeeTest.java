package com.brs.sun.test;

import static org.junit.Assert.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.brs.sun.model.dao.EmployeeDao;
import com.brs.sun.model.service.EmployeeService;
import com.brs.sun.vo.EmployeeVo;

@SpringBootTest
public class EmployeeTest {

	@Autowired
	private EmployeeService employeeService;
	
	@Autowired
	private EmployeeDao employeeDao;
	
	@Test
	void info() {
		
		EmployeeVo vo = employeeService.getOneMember("20010101");
		assertNotNull(vo);
	}
	
}
