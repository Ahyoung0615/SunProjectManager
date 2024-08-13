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
	// 
	private String deliveryDepart;
	private String deliveryArrival;
	private int freightCode;
	private int vehicleCode;
	private LocalDateTime deliveryStarttime;
	private LocalDateTime deliveryEndtime;
	private int empCode;
	private int deliveryWeight;
	private LocalDateTime deliveryDate;
	private int commCode;
}
