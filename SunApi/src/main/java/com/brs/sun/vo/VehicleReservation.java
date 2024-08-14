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
public class VehicleReservation {

	// 배차 신청서 코드, PK
	private int vrsv_code;
	// 출장 코드
	private int btrip_code;
	// 차량 코드
	private int vehicle_code;
	// 차량 대여일
	private LocalDateTime vrsv_date;
	// 신청서 상세
	private String vrsv_detail;
}
