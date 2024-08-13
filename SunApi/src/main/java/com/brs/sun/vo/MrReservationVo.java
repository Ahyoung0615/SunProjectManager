package com.brs.sun.vo;

import java.time.LocalDateTime;

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
public class MrReservationVo {

	// 회의실 예약

	// 예약 코드, PK
	private int mrrCode;
	// 회의실 코드
	private int empCode;
	// 예약한 사용자 사번
	private int meetroomCode;
	// 시작 날짜
	private LocalDateTime mrrStartTime;
	// 종료 날짜
	private LocalDateTime mrrEndTime;
}
