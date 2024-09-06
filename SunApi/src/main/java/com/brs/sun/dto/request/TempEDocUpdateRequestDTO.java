package com.brs.sun.dto.request;

import java.time.LocalDate;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@Schema(description = "임시저장 문서 상태(기안: A) 업데이트")
public class TempEDocUpdateRequestDTO {

	@Schema(description = "문서 코드")
	private int docCode;
	@Schema(description = "기안자 사원 코드")
	private int empCode;
	@Schema(description = "휴가 시작 날짜 / 지출 날짜")
	private String startDate;
	@Schema(description = "휴가 종료 날짜")
	private String endDate;
	@Schema(description = "사유")
	private String reason;
	@Schema(description = "문서 제목")
	private String docTitle;
	@Schema(description = "문서 상태")
	private String docStatus;
	@Schema(description = "기안 일자")
	private LocalDate uploadDate;
	@Schema(description = "사용 연차 개수 (휴가 신청서일 때)")
	private Integer weekdayCount;
	@Schema(description = "결재선")
	private List<Integer> approvers;
}
