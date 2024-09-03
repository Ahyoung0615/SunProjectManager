package com.brs.sun.dto.request;

import java.time.LocalDate;
import java.util.List;

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
public class ExpenseDocRequest {

	private int empCode;
	private String startDate;
	private String reason;
	private String docType;
	private String docTitle;
	private String docStatus;
	private String totalPrice;
	private String storeInfo;
	private LocalDate uploadDate;
	private List<Integer> approvers;
	private List<ExpenseSubResultRequest> items;
}
