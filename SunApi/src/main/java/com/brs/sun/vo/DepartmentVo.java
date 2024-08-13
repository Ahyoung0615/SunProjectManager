package com.brs.sun.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentVo {

	// 부서

	// 부서 코드, PK
	private int deptCode;
	// 부서명
	private String deptName;
}
