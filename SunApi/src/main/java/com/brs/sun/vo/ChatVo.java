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
public class ChatVo {

	// 채팅
	
	// 채팅 코드, PK
	private int chatCode;
	// 채팅방 코드
	private int chatroomCode;
	// 채팅방 내용
	private String chatContent;
	// 발신자
	private String chatSender;
	// 시간
	private LocalDateTime chatTime;
}
