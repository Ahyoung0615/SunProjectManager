package com.brs.sun.vo;

import java.time.LocalDateTime;

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
public class NoticeVo {

	// 공지사항

	// 게시글 코드, PK
	private int notiCode;
	// 게시글 제목
	private String notiTitle;
	// 게시글 내용
	private String notiContent;
	// 작성자 사번
	private int empCode;
	// 작성일
	private LocalDateTime notiDate;
	// 삭제 여부 (삭제 Y, 유지 N)
	private String notiDelflag;
	// 중요 게시판 여부 (중요 I, 일반 N)
	private String notiStatus;
}
