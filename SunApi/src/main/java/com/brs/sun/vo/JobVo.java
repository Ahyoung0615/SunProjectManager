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
public class JobVo {

	// 직급

	// 직급 코드, PK
	private int jobCode;
	// 직급명
	private String jobName;
}
