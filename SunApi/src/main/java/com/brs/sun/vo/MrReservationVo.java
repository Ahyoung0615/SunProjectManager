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
	// 예약한 사용자 사번
	private int empCode;
	// 회의실 코드
	private int meetroomCode;
	// 시작 날짜
	private LocalDateTime mrrStarttime;
	// 종료 날짜
	private LocalDateTime mrrEndtime;
	
	// MeetRoom Table Join
	// 회의실 이름
	private String meetroomName;
	
	// Employee Table Join
	// 예약 사원 이름
	private String empName;
	
	// Job Table Join
	// 예약 사원 직급
	private String jobName;
	
	// Department Table Join
	// 예약 사원 부서
	private String deptName;
}
