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
public class EDocVo {

	// 전자결재

	// 문서 코드, PK
	private int edocCode;
	// 문서 제목
	private String edocTitle;
	// 문서 내용
	private String edocContent;
	// 문서 타입
	private String edocType;
	// 기안자 사번
	private int empCode;
	// 기안 일자
	private LocalDate edocDate;
	// 결재 상태 (결재 대기중 A, 결재 완료(승인) S, 반려 R, 회수 C, 임시저장 T)
	private String edocStatus;
	// 반려 사유
	private String edocReply;
}
