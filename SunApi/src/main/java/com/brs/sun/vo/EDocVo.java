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
public class EDocVo {

	// 전자결재

	// 문서 코드, PK
	private int edocCode;
	// 문서 제목
	private String edocTitle;
	// 문서 내용
	private String edocContent;
	// 기안자 사번
	private int empCode;
	// 기안 일자
	private LocalDateTime edocDate;
	// 결재 상태
	private String commCode;
}
