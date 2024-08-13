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
public class ChatRoomVo {

	// 채팅방

	// 채팅방 코드, PK
	private int chatroomCode;
	// 채팅방
	private String chatroomParti;
	// 생성 일자
	private LocalDateTime chatroomCredtedat;
}
