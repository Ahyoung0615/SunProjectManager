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
public class CoWorkVo {

	// 협력 업체

	// 협력체 코드, PK
	private int cowCode;
	// 협력체 명
	private String cowName;
	// 협력체 주소
	private String cowAddress;
	// 협력체 전화번호
	private String cowTel;
}
