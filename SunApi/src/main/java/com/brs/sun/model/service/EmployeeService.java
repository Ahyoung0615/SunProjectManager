package com.brs.sun.model.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.brs.sun.dao.EmployeeDao;
import com.brs.sun.vo.EmployeeVo;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeService {

	private final BCryptPasswordEncoder bCryptPasswordEncoder;
	private final EmployeeDao employeeDao;
	
	public EmployeeVo loginEmp(String empcode, String emppw) {
		EmployeeVo emp = employeeDao.login(empcode, emppw);
		if( emp == null) {
			log.info("사용자를 찾을 수 없습니다.");
		}
		return emp;
	}
	public EmployeeVo getUserInfo(String empcode) {
		EmployeeVo user = employeeDao.Info(empcode);
        if (user != null) {
            log.info("사용자를 찾을 수 있습니다.");
        }
        return user;
    }
}
