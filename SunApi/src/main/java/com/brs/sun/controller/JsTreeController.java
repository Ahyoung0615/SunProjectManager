package com.brs.sun.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.dao.EmployeeDao;
import com.brs.sun.dto.response.JsTreeResponse;
import com.brs.sun.model.service.JsTreeService;
import com.brs.sun.vo.DepartmentVo;
import com.brs.sun.vo.EmployeeVo;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class JsTreeController {

	private final JsTreeService service;
	
	@GetMapping("/jsTree")
	public List<JsTreeResponse> getTree(){
		
		List<JsTreeResponse> jsList = new ArrayList<JsTreeResponse>();
		
		List<DepartmentVo> deptList = service.getDept();
		for (DepartmentVo departmentVo : deptList) {
			jsList.add(new JsTreeResponse(departmentVo.getDeptCode(), departmentVo.getDeptName(), "#", "./img/deptImg.png"));
		}
		
		List<EmployeeVo> empList = service.getEmp();
		for (EmployeeVo employeeVo : empList) {
			if(employeeVo.getDeptCode() == 1) {
				jsList.add(new JsTreeResponse(employeeVo.getEmpCode(), employeeVo.getEmpName(), String.valueOf(employeeVo.getDeptCode()), "./img/pikachu.png"));
			}else {
				jsList.add(new JsTreeResponse(employeeVo.getEmpCode(), employeeVo.getEmpName(), String.valueOf(employeeVo.getDeptCode()), "./img/zamanbo.png"));
			}
		}
		
		return jsList;
	}
}
