package com.brs.sun.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class EDocLineResponseDTO {

	private int empCode;
	private String empName;
	private String jobName;
	private String edclStatus;
	private String deptName;
}
