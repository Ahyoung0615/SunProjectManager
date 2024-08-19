package com.brs.sun.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.brs.sun.model.dao.EmployeeDao;
import com.brs.sun.model.service.EmployeeService;
import com.brs.sun.vo.EmployeeVo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000/")
public class EmployeeController {

	private final EmployeeService employeeService;
	
	@GetMapping(value="/memberDetail")
	public List<EmployeeVo> getAllEmployees() {
        return employeeService.empList();
    }
	@GetMapping(value="/memberDetail1")
	public List<EmployeeVo> getAllEmployees1() {
        return employeeService.empList1();
    }
	@GetMapping(value="/memberDetail2")
	public List<EmployeeVo> getAllEmployees2() {
        return employeeService.empList2();
    }
	@GetMapping(value="/memberDetail/{empCode}")
	public EmployeeVo getOneEmployee(@PathVariable String empCode) {
		return employeeService.getOneMember(empCode);
	}
	
	@PostMapping("/uploadImage")
	public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file, @RequestParam("empCode") String empCode) {
	    Map<String, String> response = new HashMap<>();
	    try {
	        employeeService.saveImage(file, empCode);
	        response.put("message", "이미지 파일 업로드 성공");
	        return ResponseEntity.ok(response);
	    } catch (Exception e) {
	        response.put("message", "이미지 파일 업로드 실패: " + e.getMessage());
	        return ResponseEntity.status(500).body(response);
	    }
	}
	@PostMapping("/resetPassword/{empCode}")
    public ResponseEntity<String> resetPassword(@PathVariable String empCode) {
		int result = employeeService.passwordReset(empCode);
        if (result == 1) {
            return ResponseEntity.ok("비밀번호가 초기화되었습니다.'1234'.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to reset password.");
        }
    }
	
	@PostMapping("/memberUpdate/{empCode}")
	public ResponseEntity<String> updateMember(@PathVariable String empCode,
			@RequestParam("EmpJob") String empJob,
	        @RequestParam("EmpDept") String empDept,
	        @RequestParam("EmpTel") String empTel,
	        @RequestParam("EmpEmail") String empEmail,
	        @RequestParam("EmpAddress") String empAddress,
	        @RequestParam("EmpStatus") String empStatus){
		int empJobStr = Integer.parseInt(empJob);
	    int empDeptStr = Integer.parseInt(empDept);
	    int empCodeStr = Integer.parseInt(empCode);
		
		EmployeeVo employeeVo = new EmployeeVo();
	    employeeVo.setEmpCode(empCodeStr);
	    employeeVo.setJobCode(empJobStr);
	    employeeVo.setDeptCode(empDeptStr);
	    employeeVo.setEmpTel(empTel);
	    employeeVo.setEmpEmail(empEmail);
	    employeeVo.setEmpAddress(empAddress);
	    employeeVo.setEmpStatus(empStatus);

	    int result = employeeService.updateMember(employeeVo);
		if (result == 1) {
            return ResponseEntity.ok("사원정보가 수정 되었습니다");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("사원정보가 수정 실패했습니다.");
        }
	}
	 @PostMapping("/NewEmp")
	    public ResponseEntity<String> registerEmployee(
	            @RequestParam("EmpName") String empName,
	            @RequestParam("EmpJob") String empJob,
	            @RequestParam("EmpDept") String empDept,
	            @RequestParam("Gender") String gender,
	            @RequestParam("EmpTel") String empTel,
	            @RequestParam("EmpEmail") String empEmail,
	            @RequestParam("EmpAddress") String empAddress) {
		// String 값을 int로 변환
		    int empJobStr = Integer.parseInt(empJob);
		    int empDeptStr = Integer.parseInt(empDept);
		 // EmployeeVo 객체 생성
		    EmployeeVo employeeVo = new EmployeeVo();
		    employeeVo.setEmpName(empName);
		    employeeVo.setDeptCode(empJobStr);
		    employeeVo.setJobCode(empDeptStr);
		    employeeVo.setGender(gender);
		    employeeVo.setEmpTel(empTel);
		    employeeVo.setEmpEmail(empEmail);
		    employeeVo.setEmpAddress(empAddress);

		    // Employee 등록 서비스 호출
		    employeeService.registerEmployee(employeeVo);

		    // 성공 메시지 반환
		    return ResponseEntity.ok("사원 등록이 완료되었습니다.");
	    }
	
}
