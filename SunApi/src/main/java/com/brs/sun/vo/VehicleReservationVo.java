package com.brs.sun.vo;

import java.time.LocalDate;
import java.util.Map;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class VehicleReservationVo {

	// 배차 신청서 코드, PK
	private int vrsvCode;
	// 출장 코드
	private int bTripCode;
	// 차량 코드
	private int vehicleCode;
	// 차량 대여일
	private String  vrsvDate;
	// 신청서 상세
	private String vrsvDetail;
	// 신청서 승인 현황 (대기 W, 승인 Y, 반려 N)
	private String vrsvStatus;
	// 신청서 반려 사유
	private String vrsvReply;
	
	  // 예약 시작일과 종료일을 처리하기 위한 필드 (JSON 파싱 후 설정)
    private LocalDate startDate;
    private LocalDate endDate;
    
    public void setVrsvDate(String vrsvDate) {
        this.vrsvDate = vrsvDate;
        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, String> dateMap = mapper.readValue(vrsvDate, Map.class);
            this.startDate = LocalDate.parse(dateMap.get("start"));
            this.endDate = LocalDate.parse(dateMap.get("end"));
        } catch (Exception e) {
            e.printStackTrace();
            // 필요에 따라 예외 처리를 추가할 수 있습니다.
        }
    }
}
