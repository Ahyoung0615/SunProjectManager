package com.brs.sun.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.model.service.EmployeeService;
import com.brs.sun.vo.EmployeeVo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000/")
public class EmployeeController {

	private final EmployeeService employeeService;
	
	@GetMapping(value="/memberDetail")
	public List<EmployeeVo> getAllEmployees() {
        return employeeService.empList();
    }
	
}
