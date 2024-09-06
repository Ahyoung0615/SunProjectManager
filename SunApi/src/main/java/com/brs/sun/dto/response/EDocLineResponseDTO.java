package com.brs.sun.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
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

	@Schema(description = "사원 코드")
	private int empCode;
	@Schema(description = "사원 이름")
	private String empName;
	@Schema(description = "사원 직무 이름")
	private String jobName;
	@Schema(description = "결재 상태(결재 대기중 A, 승인(결재 완료) S, 반려 R)")
	private String edclStatus;
	@Schema(description = "사원 부서 이름")
	private String deptName;
}
