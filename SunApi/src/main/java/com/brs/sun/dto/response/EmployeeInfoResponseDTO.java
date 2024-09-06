package com.brs.sun.dto.response;

import com.brs.sun.jpa.entity.EmployeeEntity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeInfoResponseDTO {

	@Schema(description = "사원 코드")
	private Integer empCode;
	@Schema(description = "사원 이름")
	private String empName;
	@Schema(description = "부서 코드")
	private int deptCode;
	@Schema(description = "직급 코드")
	private int jobCode;
	
	@Schema(description = "EmployeeInfoResponse 객체로 생성하여 반환")
	public static EmployeeInfoResponseDTO of(EmployeeEntity entity) {
		return new EmployeeInfoResponseDTO(entity.getEmpCode(), entity.getEmpName(), entity.getDeptCode(), entity.getJobCode());
	}
}
