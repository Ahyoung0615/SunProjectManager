package com.brs.sun.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MrReservationDetailFullCalendarDTO {

	private int mrrCode;
	private int empCode;
	private String empName;
	private String jobName;
	private String deptName;
	private LocalDateTime start;
	private LocalDateTime end;
	private String title;
	
}
