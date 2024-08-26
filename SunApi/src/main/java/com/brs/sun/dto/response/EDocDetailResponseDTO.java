package com.brs.sun.dto.response;

import java.time.LocalDate;

import com.brs.sun.vo.EDocVo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EDocDetailResponseDTO {
	
	private String eDocTitle;
	private String eDocContent;
	private LocalDate eDocDate;
	private String edocType;
	private String edocStatus;
	
	public static EDocDetailResponseDTO of(EDocVo vo) {
		return new EDocDetailResponseDTO(vo.getEdocTitle(), vo.getEdocContent(), vo.getEdocDate(), vo.getEdocType(), vo.getEdocStatus());
	}
}
