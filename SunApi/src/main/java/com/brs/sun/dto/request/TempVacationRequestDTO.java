package com.brs.sun.dto.request;

import java.time.LocalDate;
import java.util.List;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class TempVacationRequestDTO {

	private int empCode;
	private String startDate;
	private String endDate;
	private String reason;
	private String docType;
	private String edtempTitle;
	private LocalDate uploadDate;
	private Integer weekdayCount;
	private List<Integer> approvers;
}
