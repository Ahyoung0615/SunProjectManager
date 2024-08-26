package com.brs.sun.dto.request;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class EDocRejectRequestDTO {

	private int empCode;
	private int edocCode;
	private String empName;
	private String jobName;
	private String deptName;
	private String reason;
	private String rejectDate;
}
