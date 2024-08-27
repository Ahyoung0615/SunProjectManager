package com.brs.sun.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MrReservationFullCalendarDTO {

	private int id;
	private LocalDateTime start;
	private LocalDateTime end;
	private String title;
}
