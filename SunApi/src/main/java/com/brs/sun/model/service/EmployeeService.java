package com.brs.sun.model.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.brs.sun.model.dao.EmployeeDao;
import com.brs.sun.vo.EmployeeVo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeService {

	private final EmployeeDao employeeDao;
	
	public List<EmployeeVo> empList(){
		log.info("사원 리스트 조회");
		return employeeDao.MemberList();
	}
	
	
	
}
