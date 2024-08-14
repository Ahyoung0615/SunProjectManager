package com.brs.sun.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.brs.sun.vo.EmployeeVo;


@Mapper
public interface EmployeeDao {

	List<EmployeeVo> MemberList();
	
	EmployeeVo login(String empcode, String emppw);
	
	EmployeeVo Info(String empcode);
}
