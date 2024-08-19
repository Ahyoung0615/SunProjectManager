package com.brs.sun.model.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
	private final BCryptPasswordEncoder bCryptPasswordEncoder;

	public List<EmployeeVo> empList(){
		log.info("사원 리스트 조회");
		return employeeDao.MemberList();
	}
	public EmployeeVo getOneMember(String empCode) {
		 return employeeDao.Info(empCode);
	             
	}
	public List<EmployeeVo> empList1(){
		log.info("사원 리스트 조회");
		return employeeDao.MemberList1();
	}
	public List<EmployeeVo> empList2(){
		log.info("사원 리스트 조회");
		return employeeDao.MemberList2();
	}

	public int updateMember(EmployeeVo employeeVo) {
		int result = employeeDao.updateMember(employeeVo);
		return result > 0? 1 : 0;
	}
	
	public int passwordReset(String empCode) {
		 

	        // 비밀번호 업데이트 쿼리 실행
	        int result = employeeDao.passwordReset(empCode);
	        return result > 0 ? 1 : 0; // 성공 시 1, 실패 시 0 반환
	}
	public void registerEmployee(EmployeeVo employeeVo) {
		employeeDao.insertEmployee(employeeVo);
	}
	
}
