package com.brs.sun.dto.request;

import java.time.LocalDate;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Schema(description = "지출 결의서 Request DTO")
public class ExpenseDocRequest {

	@Schema(description = "사원 코드")
	private int empCode;
	@Schema(description = "사용 일자")
	private String startDate;
	@Schema(description = "지출 사유")
	private String reason;
	@Schema(description = "문서 타입 (휴가: V, 지출: E)")
	private String docType;
	@Schema(description = "문서 제목")
	private String docTitle;
	@Schema(description = "문서 상태 (기안: A, 임시: T)")
	private String docStatus;
	@Schema(description = "지출 총합")
	private String totalPrice;
	@Schema(description = "사용처")
	private String storeInfo;
	@Schema(description = "기안 일자")
	private LocalDate uploadDate;
	@Schema(description = "결재선")
	private List<Integer> approvers;
	@Schema(description = "지출 상세 내역")
	private List<ExpenseSubResultRequest> items;
}
