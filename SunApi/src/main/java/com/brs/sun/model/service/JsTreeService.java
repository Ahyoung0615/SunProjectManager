package com.brs.sun.model.service;

import java.util.List;

import com.brs.sun.vo.DepartmentVo;
import com.brs.sun.vo.EmployeeVo;

public interface JsTreeService {

	/**
	 * 전체 부서 리스트 반환
	 * @return List<DepartmentVo>
	 */
	public List<DepartmentVo> getDept();
	
	/**
	 * 전체 사원 리스트 반환
	 * @return List<EmployeeVo>
	 */
	public List<EmployeeVo> getEmp();
}
