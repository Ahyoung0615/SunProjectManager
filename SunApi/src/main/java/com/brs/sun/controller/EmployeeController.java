package com.brs.sun.controller;

import java.util.Base64;
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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000/")
@Tag(name = "사원관리 Controller", description = "사원 관리 관련 API")
public class EmployeeController {

	private final EmployeeService employeeService;

	// 사원리스트 불러오기1
	@Operation(summary = "사원 목록 조회", description = "모든 사원의 상세 정보를 조회합니다.")
	@ApiResponse(responseCode = "200", description = "사원 목록이 성공적으로 반환되었습니다.")
	@GetMapping(value = "/memberDetail")
	public List<EmployeeVo> getAllEmployees() {
		return employeeService.empList();
	}

	// 사원리스트 불러오기2
	@GetMapping(value = "/memberDetail1")
	public List<EmployeeVo> getAllEmployees1() {
		return employeeService.empList1();
	}

	// 사원리스트 불러오기3
	@GetMapping(value = "/memberDetail2")
	public List<EmployeeVo> getAllEmployees2() {
		return employeeService.empList2();
	}

	// 사원 상세보기
	@Operation(summary = "사원 상세 정보 조회", description = "특정 사원의 코드를 통해 상세 정보를 조회합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "사원 정보가 성공적으로 반환되었습니다."),
		@ApiResponse(responseCode = "404", description = "해당 사원을 찾을 수 없습니다.")
	})
	@GetMapping(value = "/memberDetail/{empCode}")
	public EmployeeVo getOneEmployee(@PathVariable String empCode) {
		return employeeService.getOneMember(empCode);
	}

	// 사원 이미지 업로드
	@PostMapping("/uploadImage")
	public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file,
			@RequestParam("empCode") String empCode) {
		Map<String, String> response = new HashMap<>();
		try {
			employeeService.saveImage(file, empCode);
			byte[] memberImageBytes = file.getBytes();
			
			String base64Encoded = Base64.getEncoder().encodeToString(memberImageBytes);
			response.put("ImageToBase64", base64Encoded);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			response.put("message", "이미지 파일 업로드 실패: " + e.getMessage());
			return ResponseEntity.status(500).body(response);
		}
	}
	
	@Operation(summary = "사원 이미지 조회", description = "사원의 이미지를 조회합니다.")
	@ApiResponse(responseCode = "200", description = "이미지가 성공적으로 반환되었습니다.")
	@GetMapping("/getMemberImage")
	public String getMemberImage(@RequestParam String empCode) {
		return employeeService.getMemberImage(empCode);
	}

	// 사원 비밀번호 초기화
	@PostMapping("/resetPassword/{empCode}")
	public ResponseEntity<String> resetPassword(@PathVariable String empCode) {
		int result = employeeService.passwordReset(empCode);
		if (result == 1) {
			return ResponseEntity.ok("비밀번호가 초기화되었습니다.'1234'.");
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to reset password.");
		}
	}

	// 사원 정보 수정
	@PostMapping("/memberUpdate/{empCode}")
	public ResponseEntity<String> updateMember(@PathVariable String empCode, @RequestParam("EmpJob") String empJob,
			@RequestParam("EmpDept") String empDept, @RequestParam("EmpTel") String empTel,
			@RequestParam("EmpEmail") String empEmail, @RequestParam("EmpAddress") String empAddress,
			@RequestParam("EmpStatus") String empStatus) {
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

	// 새로운 사원 추가
	@Operation(summary = "사원 추가", description = "새로운 사원을 추가합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "사원이 성공적으로 등록되었습니다."),
		@ApiResponse(responseCode = "400", description = "사원 등록 실패.")
	})
	@PostMapping("/NewEmp")
	public ResponseEntity<String> registerEmployee(@RequestParam("EmpName") String empName,
			@RequestParam("EmpJob") String empJob, @RequestParam("EmpDept") String empDept,
			@RequestParam("Gender") String gender, @RequestParam("EmpTel") String empTel,
			@RequestParam("EmpEmail") String empEmail, @RequestParam("EmpAddress") String empAddress) {
		// String 값을 int로 변환
		int empJobStr = Integer.parseInt(empJob);
		int empDeptStr = Integer.parseInt(empDept);
		// EmployeeVo 객체 생성
		EmployeeVo employeeVo = new EmployeeVo();
		if (empDept.equals("1") || empDept.equals("11")) {
			employeeVo.setEmpAuth("A");
		} else {
			employeeVo.setEmpAuth("U");
		}
		employeeVo.setEmpName(empName);
		employeeVo.setDeptCode(empDeptStr);
		employeeVo.setJobCode(empJobStr);
		employeeVo.setGender(gender);
		employeeVo.setEmpTel(empTel);
		employeeVo.setEmpEmail(empEmail);
		employeeVo.setEmpAddress(empAddress);

		// Employee 등록 서비스 호출
		employeeService.registerEmployee(employeeVo);

		// 성공 메시지 반환
		return ResponseEntity.ok("사원 등록이 완료되었습니다.");
	}

	// 사원 비밀번호 수정
	@PostMapping("/updatePassword/{empCode}")
	public ResponseEntity<String> changerPassword(@PathVariable String empCode, String CurrentPassword,
			String ChangePassword) {
		boolean success = employeeService.changePassword(empCode, CurrentPassword, ChangePassword);
		if (success) {
			return ResponseEntity.ok("비밀번호 변경완료");
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("비밀번호 변경 실패: 현재 비밀번호가 올바르지 않거나 사용자 정보를 찾을 수 없습니다.");
		}
	}

}
