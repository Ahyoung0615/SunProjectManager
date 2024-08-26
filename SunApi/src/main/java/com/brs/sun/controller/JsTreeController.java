package com.brs.sun.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.dto.response.JsTreeResponseDTO;
import com.brs.sun.model.service.JsTreeService;
import com.brs.sun.vo.DepartmentVo;
import com.brs.sun.vo.EmployeeVo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class JsTreeController {

	private final JsTreeService service;
	
	/***
	 * JsTree Controller
	 * @return 부서 리스트 > 사원 구조로 JSON 형태
	 */
	@GetMapping("/jsTree")
	public List<JsTreeResponseDTO> getTree(){
		
		List<JsTreeResponseDTO> jsList = new ArrayList<JsTreeResponseDTO>();
		
		List<DepartmentVo> deptList = service.getDept();
		for (DepartmentVo departmentVo : deptList) {
			if(departmentVo.getDeptCode() == 1) {
				jsList.add(new JsTreeResponseDTO(departmentVo.getDeptCode(), departmentVo.getDeptName(), "#", "./img/masterBall.png"));
			} else {
				jsList.add(new JsTreeResponseDTO(departmentVo.getDeptCode(), departmentVo.getDeptName(), "#", "./img/deptImg.png"));
			}
		}
		
		List<EmployeeVo> empList = service.getEmp();
		for (EmployeeVo employeeVo : empList) {
			if(employeeVo.getDeptCode() == 1) {
				jsList.add(new JsTreeResponseDTO(employeeVo.getEmpCode(), employeeVo.getEmpName(), String.valueOf(employeeVo.getDeptCode()), "./img/pikachu.png"));
			}else {
				jsList.add(new JsTreeResponseDTO(employeeVo.getEmpCode(), employeeVo.getEmpName(), String.valueOf(employeeVo.getDeptCode()), "./img/zamanbo.png"));
			}
		}
		
		return jsList;
	}
	
	/**
	 * jsTree 에서 서버로 전송된 Array 사용 Api
	 * @param choiceList
	 * @return List<EmployeeVo>
	 */
	@PostMapping("/empList")
	public List<EmployeeVo> getApprovers(@RequestBody List<String> choiceList) {
		log.info("choiceArr: {}", choiceList);
		List<EmployeeVo> approverList = service.getApprovers(choiceList);
		return approverList;
	}
}
