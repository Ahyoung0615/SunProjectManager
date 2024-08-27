package com.brs.sun.dto.response;

import com.brs.sun.jpa.entity.EmployeeEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeInfoResponseDTO {

	private Integer empCode;
	private String empName;
	private int deptCode;
	private int jobCode;
	
	public static EmployeeInfoResponseDTO of(EmployeeEntity entity) {
		return new EmployeeInfoResponseDTO(entity.getEmpCode(), entity.getEmpName(), entity.getDeptCode(), entity.getJobCode());
	}
}
