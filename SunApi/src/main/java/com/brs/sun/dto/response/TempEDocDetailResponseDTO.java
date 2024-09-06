package com.brs.sun.dto.response;

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
public class TempEDocDetailResponseDTO {

	@Schema(description = "문서 제목")
	private String edocTitle;
	@Schema(description = "문서 내용")
	private String edocContent;
	
	@Schema(description = "TempEDocDetailResponse 객체로 생성해서 반환")
	public static TempEDocDetailResponseDTO of(EDocVo vo) {
		return new TempEDocDetailResponseDTO(vo.getEdocTitle(), vo.getEdocContent());
	}
}
