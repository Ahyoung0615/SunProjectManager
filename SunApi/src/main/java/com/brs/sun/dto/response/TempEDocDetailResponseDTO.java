package com.brs.sun.dto.response;

import com.brs.sun.vo.EDocVo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TempEDocDetailResponseDTO {

	private String edocTitle;
	private String edocContent;
	
	public static TempEDocDetailResponseDTO of(EDocVo vo) {
		return new TempEDocDetailResponseDTO(vo.getEdocTitle(), vo.getEdocContent());
	}
}
