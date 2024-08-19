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
public class BTripVo {

	// 출장
	
	// 출잘 번호, PK
	private int bTripCode;
	// 사번
	private int empCode;
	// 출장지
	private String bTripArrival;
	// 출발지
	private String bTripDepart;
	// 상세
	private String bTripDetail;
	// 시작 날짜
	private LocalDateTime bTripStartDate;
	// 종료 날짜
	private LocalDateTime bTripEndDate;
	// 차량 코드
	private String vehicleCode;
}
