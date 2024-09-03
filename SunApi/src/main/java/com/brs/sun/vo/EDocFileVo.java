package com.brs.sun.vo;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class EDocFileVo {

	// 전자결재 파일
	
	// 전자결재 파일 코드
	private String efileCode;
	// 전자결재 문서 코드
	private String edocCode;
	// 파일 이름
	private String efileName;
	// 파일 경로
	private String efilePath;
	// 업로드 일자
	private LocalDate efileDate;
	// 삭제 여부
	private String efileDelflag;
	
	// 영수증 파일
	private MultipartFile receipt;
}
