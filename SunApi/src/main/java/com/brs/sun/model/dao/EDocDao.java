package com.brs.sun.model.dao;

import java.util.List;

import com.brs.sun.vo.EDocLineVo;
import com.brs.sun.vo.EDocVo;
import com.brs.sun.vo.EmployeeVo;

public interface EDocDao {

	List<EDocVo> selectAppEmp(int empCode);
	
	boolean insertEDoc(EDocVo vo);
	
	boolean insertEDocLine(List<EDocLineVo> vo);
}
