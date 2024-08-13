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
public class CommKeyVo {

	// 공통

	// 공통 코드 번호, PK
	private int commCode;
	// 사용자 권한 (유저 U, 관리자 A)
	private String authstatus;
	// 근무 상태 코드 (근무중 I, 대기발령 W, 퇴근 O, 출장 T, 휴가 V)
	private String workstatus;
	// 차량 상테 (출차 O, 보관 I, 수리 R)
	private String vehiclestatus;
	// 차량 수리 여부 (완료 O, 수리중 I)
	private String repairstatus;
	// 중요 게시글 여부 (중요 I, 일반 N)
	private String boardimpstatus;
	// 운송 상태 (예약 R, 도착 A, 취소 C)
	private String deliverystatus;
	// 전자결재 상태 (결재중 A, 결재 완료 S, 반려 R, 회수 C)
	private String docstatus;
}
