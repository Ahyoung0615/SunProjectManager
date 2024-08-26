package com.brs.sun.vo;

import java.nio.file.Path;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Builder
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class NoticeFileVo {

	// 공지사항 파일

	// 파일 코드, PK
	private int nfileCode;
	// 게시글 코드
	private int notiCode;
	// 파일 원본명
	private String nfileOriginname;
	// 파일 수정명
	private String nfileFakename;
	// 파일 경로
	private String nfilePath;
	// 업로드 날짜
	private LocalDateTime nfileDate;
	// 파일 타입
	private String nfileType;
	// 파일 사이즈
	private Long notiSize;
	// 삭제 여부
	private String nfileDelflag;
}
