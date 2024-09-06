package com.brs.sun.dto.response;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MrReservationFullCalendarDTO {

	@Schema(description = "예약 코드")
	private int id;
	@Schema(description = "예약 시작 일자")
	private LocalDateTime start;
	@Schema(description = "예약 종료 일자")
	private LocalDateTime end;
	@Schema(description = "예약 제목")
	private String title;
}
