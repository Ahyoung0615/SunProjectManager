package com.brs.sun.vo;

import java.time.LocalDate;

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
public class VehicleVo {

	// 차량

	// 차량 코드, PK
	private int vehicleCode;
	// 차량 번호
	private String vehicleNo;
	// 차종
	private String vehicleModel;
	// 등록 일자
	private LocalDate vehicleRegdate;
	// 구분 (영엽용 C, 화물용 F)
	private String vehicleType;
	// 인승
	private int vehicleSize;
	// 현황 (삭제 Y, 사용중 N)
	private String vehicleDelflag;
	// 차량 이미지
	private String vehicleImg;
	// 차량 수리 여부 (출차 O, 보관 I, 수리 R)
	private String vehicleStatus;
}
