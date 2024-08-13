package com.brs.sun.dao;

import org.apache.ibatis.annotations.Mapper;

import com.brs.sun.vo.EmployeeVo;



@Mapper
public interface EmployeeDao {

	EmployeeVo login(String empcode, String emppw);
	
	EmployeeVo Info(String empcode);
}
