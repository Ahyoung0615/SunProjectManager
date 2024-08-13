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
public class ChatFileVo {

	// 채팅방 파일
	
	// 채팅방 파일 코드, PK
	private int cfileCode;
	// 채팅방 코드
	private int chatCode;
	// 파일 이름
	private String cfileName;
	// 파일 경로
	private String cfilePath;
	// 파일 크기
	private int cfileSize;
	// 업로드 일자
	private LocalDateTime cfileDate;
}
