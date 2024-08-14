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
public class DeliveryVo {

	// 운송 테이블

	// 운송 코드, PK
	private int deliveryCode;
	// 출발지
	private String deliveryDepart;
	// 도착지
	private String deliveryArrival;
	// 화물 코드
	private int freightCode;
	// 차량 코드
	private int vehicleCode;
	// 배송 시작 날짜
	private LocalDateTime deliveryStarttime;
	// 배송 종료 날짜
	private LocalDateTime deliveryEndtime;
	// 배송 직원 사번
	private int empCode;
	// 배송 용량 (무게)
	private int deliveryWeight;
	// 운송 상태 (예약 R, 출발 D, 도착 A, 취소 C)
	private String deliveryStatus;
}
