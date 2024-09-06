package com.brs.sun.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@Schema(description = "기안 문서 반려 Request DTO")
public class EDocRejectRequestDTO {

	@Schema(description = "반려한 사원 코드")
	private int empCode;
	@Schema(description = "반려 문서 코드")
	private int edocCode;
	@Schema(description = "반려 사원 이름")
	private String empName;
	@Schema(description = "반려 사원 직급")
	private String jobName;
	@Schema(description = "반려 사원 부서")
	private String deptName;
	@Schema(description = "반려 사유")
	private String reason;
	@Schema(description = "반려 날짜")
	private String rejectDate;
	@Schema(description = "사용 연차")
	private int weekdayCount;
	@Schema(description = "반려 당한 연차 기안자 코드")
	private int docEmpCode;
}
