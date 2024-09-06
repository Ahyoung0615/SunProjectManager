package com.brs.sun.dto.response;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class EDocListRespopnseDTO {

	@Schema(description = "문서 코드")
	private Long eDocCode;
	@Schema(description = "문서 제목")
	private String eDocTitle;
	@Schema(description = "문서 기안 일자")
	private LocalDate eDocDate;
	@Schema(description = "문서 상태(결재중: A, 결재 완료: S, 회수: C, 반려: R)")
	private String eDocStatus;
}
