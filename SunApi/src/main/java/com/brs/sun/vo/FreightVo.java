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
public class FreightVo {

	// 화물 테이블
	
	// 화물 코드, PK
	private int freightCode;
	// 화물명
	private String freightName;
	// 상세 (제거)
	private String freightDetail;
}
