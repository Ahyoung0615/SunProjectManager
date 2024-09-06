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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "JsTree Controller", description = "JsTree 라이브러리 사용 위한 API Controller")
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
	@Operation(summary = "트리 구조 형태로 반환", description = "부서 > 사원 형태로 parent Mapping")
	@ApiResponse(responseCode = "200", description = "트리 구조 반환 성공", content = @Content(mediaType = "application", schema = @Schema(implementation = JsTreeResponseDTO.class)))
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
	@Operation(summary = "선택된 사원 리스트", description = "JsTree 에서 선택된 Node 의 ID(사원 코드)로 사원 정보 조회")
	@Parameter(name = "choiceList", description = "선택된 Node ID List")
	@ApiResponse(responseCode = "200", description = "전달받은 사원 코드들로 사원 정보 조회", content = @Content(schema = @Schema(implementation = EmployeeVo.class)))
	@PostMapping("/empList")
	public List<EmployeeVo> getApprovers(@RequestBody List<String> choiceList) {
	    log.info("choiceArr: {}", choiceList);
	    
	    // Approver 리스트를 가져옵니다.
	    List<EmployeeVo> approverList = service.getApprovers(choiceList);
	    
	    // jobCode에 따라 내림차순으로 정렬합니다.
	    approverList.sort((e1, e2) -> Integer.compare(e2.getJobCode(), e1.getJobCode()));
	    
	    return approverList;
	}

}
