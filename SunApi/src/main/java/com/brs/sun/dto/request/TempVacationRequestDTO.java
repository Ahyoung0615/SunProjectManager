package com.brs.sun.dto.request;

import java.time.LocalDate;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class TempVacationRequestDTO {

	@Schema(description = "기안자 사원 코드")
	private int empCode;
	@Schema(description = "연차 시작 날짜")
	private String startDate;
	@Schema(description = "연차 종료 날짜")
	private String endDate;
	@Schema(description = "사유")
	private String reason;
	@Schema(description = "문서 타입 (휴가: V, 지출: E)")
	private String docType;
	@Schema(description = "임시 문서 제목")
	private String edtempTitle;
	@Schema(description = "기안 날짜")
	private LocalDate uploadDate;
	@Schema(description = "사용 연차 개수")
	private Integer weekdayCount;
	@Schema(description = "결재선")
	private List<Integer> approvers;
}
