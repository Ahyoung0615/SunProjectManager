package com.brs.sun.dto.request;

import java.time.LocalDate;

import com.google.gson.JsonObject;

import lombok.Data;

@Data
public class BTripRequestDTO {

    private int empCode;
    
    private LocalDate brstartdate;  // 시작 날짜를 LocalDate로 변경
    private LocalDate brenddate;    // 종료 날짜를 LocalDate로 변경
    private String brdetail;        // 출장 상세 정보
    private String brdepart;        // 출발지
    private String brarrival;       // 도착지
    private LocalDate rentStartDate; // 차량 대여 시작 날짜를 LocalDate로 변경
    private LocalDate rentEndDate;   // 차량 대여 종료 날짜를 LocalDate로 변경
    private int vehicleCode;         // 차량 코드
    private String vrsvDetail;       // 예약 상세 정보

    // vrsvDate는 JSON 문자열로 변환되므로, 이 부분은 그대로 유지
    public String getVrsvDate() {
        JsonObject object = new JsonObject();
        object.addProperty("start", rentStartDate.toString());
        object.addProperty("end", rentEndDate.toString());
        return object.toString();
    }
}
