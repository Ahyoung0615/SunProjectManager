package com.brs.sun.vo;

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
public class DayOffVo {

	// 연차
	
	// 사번, PK
	private int empCode;
	// 잔여 연차
	private int dayoffLeft;
	// 사용한 연차
	private int dayoffUsed;
}
