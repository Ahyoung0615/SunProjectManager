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
public class EDocLineVo {

	// 결재선
	
	// 결재선 코드, PK
	private int edclCode;
	// 문서 코드
	private int edocCode;
	// 기안자 사번
	private int empCode;
	// 현재 결재 대상자 사번
	private int edtempApp;
	// 결재 상태
	private String edclStatus;
}
