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
public class VehicleReservationVo {

	// 배차 신청서 코드, PK
	private int vrsvCode;
	// 출장 코드
	private int btripCode;
	// 차량 코드
	private int vehicleCode;
	// 차량 대여일
	private LocalDateTime vrsvDate;
	// 신청서 상세
	private String vrsvDetail;
	// 신청서 승인 현황 (대기 W, 승인 Y, 반려 N)
	private String vrsvStatus;
	// 신청서 반려 사유
	private String vrsvReply;
}
