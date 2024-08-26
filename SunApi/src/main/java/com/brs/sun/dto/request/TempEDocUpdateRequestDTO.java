package com.brs.sun.dto.request;

import java.time.LocalDate;
import java.util.List;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class TempEDocUpdateRequestDTO {

	private int docCode;
	private int empCode;
	private String startDate;
	private String endDate;
	private String reason;
	private String docTitle;
	private String docStatus;
	private LocalDate uploadDate;
	private Integer weekdayCount;
	private List<Integer> approvers;
}
