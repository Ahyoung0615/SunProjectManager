package com.brs.sun.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class EDocLineVo {

	// 결재선
	
	// 결재선 코드, PK
	private int edclCode;
	// 문서 코드
	private int edocCode;
	// 결재 대상자 사번
	private int empCode;
	// 결재 상태 (결재 대기중 A, 승인(결재 완료) S, 반려 R)
	private String edclStatus;
	
	// 결재 라인 insert 위한 생성자
	public EDocLineVo(int edocCode, int empCode) {
		super();
		this.edocCode = edocCode;
		this.empCode = empCode;
	}
	
}
