package com.brs.sun.model.service;

import java.util.List;

import com.brs.sun.vo.DepartmentVo;
import com.brs.sun.vo.EmployeeVo;

public interface JsTreeService {

public List<DepartmentVo> getDept();
	
	public List<EmployeeVo> getEmp();
}
