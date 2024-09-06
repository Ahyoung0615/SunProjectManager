package com.brs.sun.dto.request;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class MrReservationOverlapRequestDTO {

	@Schema(description = "예약 시작 시간")
    private LocalDateTime mrrStarttime;
	@Schema(description = "예약 종료 시간")
    private LocalDateTime mrrEndtime;
	@Schema(description = "예약 시설 코드 번호")
    private int meetroomCode;
    
}
