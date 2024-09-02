package com.brs.sun.dto.request;

import java.time.LocalDateTime;

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

    private LocalDateTime mrrStarttime;
    private LocalDateTime mrrEndtime;
    private int meetroomCode;
    
}
