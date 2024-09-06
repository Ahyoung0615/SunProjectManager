package com.brs.sun.dto.response;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MrReservationDetailFullCalendarDTO {

	@Schema(description = "예약 코드")
	private int mrrCode;
	@Schema(description = "예약자 사번")
	private int empCode;
	@Schema(description = "예약자 이름")
	private String empName;
	@Schema(description = "예약자 직급 명")
	private String jobName;
	@Schema(description = "예약자 부서명")
	private String deptName;
	@Schema(description = "예약 시작 일자")
	private LocalDateTime start;
	@Schema(description = "예약 종료 일자")
	private LocalDateTime end;
	@Schema(description = "예약 제목")
	private String title;
	
}
