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
	private int btripCode;
	// 사번
	private int empCode;
	// 출장지
	private String btripArrival;
	// 출발지
	private String btripDepart;
	// 상세
	private String btripDetail;
	// 시작 날짜
	private LocalDateTime btripStartDate;
	// 종료 날짜
	private LocalDateTime btripEndDate;
	// 차량 코드
	private String vehicleCode;
}
