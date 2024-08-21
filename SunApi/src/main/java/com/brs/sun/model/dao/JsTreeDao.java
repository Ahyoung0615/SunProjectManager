package com.brs.sun.model.dao;

import java.util.List;

import com.brs.sun.vo.DepartmentVo;
import com.brs.sun.vo.EmployeeVo;

public interface JsTreeDao {

	List<DepartmentVo> getDept();
	
	List<EmployeeVo> getEmp();
	
	List<EmployeeVo> getApprovers(List<String> empCodes);
}
 