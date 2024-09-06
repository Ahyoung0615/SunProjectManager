package com.brs.sun.dto.request;

import java.time.LocalDate;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@Schema(description = "휴가 신청서 Request DTO")
public class VacationRequestDTO {
	
	@Schema(description = "문서 작성 사원 코드")
	private int empCode;
	@Schema(description = "휴가 시작 날짜")
	private String startDate;
	@Schema(description = "휴가 종료 날짜")
	private String endDate;
	@Schema(description = "휴가 사유")
	private String reason;
	@Schema(description = "문서 타입 >> V: 휴가, E: 지출")
	private String docType;
	@Schema(description = "문서 제목")
	private String docTitle;
	@Schema(description = "문서 상태 >> A: 기안, T: 임시")
	private String docStatus;
	@Schema(description = "문서 기안 날짜")
	private LocalDate uploadDate;
	@Schema(description = "사용 연차 갯수")
	private Integer weekdayCount;
	@Schema(description = "결재선")
	private List<Integer> approvers;
}
