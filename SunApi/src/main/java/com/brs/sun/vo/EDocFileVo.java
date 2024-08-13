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
public class EDocFileVo {

	// 전자결재 파일
	
	// 전자결재 파일 코드
	private String efile_code;
	// 전자결재 문서 코드
	private String edoc_code;
	// 파일 이름
	private String efile_name;
	// 파일 경로
	private String efile_path;
	// 업로드 일자
	private String efile_date;
	// 삭제 여부
	private String efile_delflag;
}
