package com.brs.sun.dto.response;

import java.time.LocalDate;

import com.brs.sun.vo.EDocVo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EDocDetailResponseDTO {
	
	@Schema(description = "문서 제목")
	private String eDocTitle;
	@Schema(description = "문서 내용")
	private String eDocContent;
	@Schema(description = "기안 날짜")
	private LocalDate eDocDate;
	@Schema(description = "문서 타입(휴가: V, 지출: E)")
	private String edocType;
	@Schema(description = "문서 상태(결재중: A, 결재 완료: S, 회수: C, 반려: R)")
	private String edocStatus;
	@Schema(description = "반려 사유")
	private String edocReply;
	@Schema(description = "기안자 사번")
	private int empCode;
	
	@Schema(description = "EDocDetailResponse 객체로 생성하여 반환")
	public static EDocDetailResponseDTO of(EDocVo vo) {
		return new EDocDetailResponseDTO(vo.getEdocTitle(), vo.getEdocContent(), vo.getEdocDate(), vo.getEdocType(), 
										 vo.getEdocStatus(), vo.getEdocReply(), vo.getEmpCode());
	}
}
