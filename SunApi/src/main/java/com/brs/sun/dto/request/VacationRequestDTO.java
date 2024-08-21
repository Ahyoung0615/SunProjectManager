package com.brs.sun.dto.request;

import java.util.List;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class VacationRequestDTO {
	private String startDate;
	private String endDate;
	private String reason;
	private String docType;
	private Integer weekdayCount;
	private List<Integer> approvers;
}
