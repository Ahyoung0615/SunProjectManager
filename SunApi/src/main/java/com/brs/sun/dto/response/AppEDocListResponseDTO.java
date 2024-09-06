package com.brs.sun.dto.response;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class AppEDocListResponseDTO {
	
	@Schema(description = "문서 코드")
	private Long eDocCode;
	@Schema(description = "문서 제목")
	private String eDocTitle;
	@Schema(description = "문서 기안 날짜")
	private LocalDate eDocDate;
	@Schema(description = "기안자 이름")
	private String empName;
	
	@Schema(description = "AppEDocListResponse 객체로 생성하여 반환")
	public static AppEDocListResponseDTO of(Long eDocCode, String eDocTitle, LocalDate eDocDate, String empName) {
        return new AppEDocListResponseDTO(eDocCode, eDocTitle, eDocDate, empName);
    }
	
}
