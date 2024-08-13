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
public class RepairVo {

	// 차량 수리 내역

	// 수리내역 코드, PK
	private int repairCode;
	// 차량 코드
	private int vehicleCode;
	// 수리 내역 상세
	private String repairDetail;
	// 수리 일자
	private LocalDateTime repairDate;
	// 수리 내역
	private String repairReason;
	// 수리 현황
	private int commode;
}
