package com.brs.sun.dto.response;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TempEDocListResponseDTO {

	@Schema(description = "문서 코드")
	private Long eDocCode;
	@Schema(description = "문서 제목")
	private String eDocTitle;
	@Schema(description = "기안 날짜")
	private LocalDate eDocDate;
}
