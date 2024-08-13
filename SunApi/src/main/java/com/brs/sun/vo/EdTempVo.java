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
public class EdTempVo {

	// 전자결재 임시저장

	// 임시저장 문서 코드, PK
	private int edtempCode;
	// 제목
	private String edtempTitle;
	// 상세
	private String edtempContent;
	// 기안자 사번
	private int empCode;
	// 기안 일자
	private LocalDateTime edtempDate;
}
