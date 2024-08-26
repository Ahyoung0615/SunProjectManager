package com.brs.sun.dto.response;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class EDocListRespopnseDTO {

	private Long eDocCode;
	private String eDocTitle;
	private LocalDate eDocDate;
	private String eDocStatus;
}
