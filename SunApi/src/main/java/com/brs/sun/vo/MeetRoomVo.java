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
public class MeetRoomVo {

	// 회의실

	// 회의실 코드, PK
	private int meetroomCode;
	// 회의실 이름
	private String meetroomName;
	// 회의실 크기
	private int meetroomSize;
}
