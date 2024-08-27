package com.brs.sun.dto.response;

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
public class VehicleRentDTO {
	
	private int vrsvCode;
	private int bTripCode;
	private int empCode;
	private String empName;
	private String jobName;
	private String deptName;
	private int vehicleCode;
	private String vehicleNo;
	private String vrsvDate;
	private String vrsvDetail;
	private String vrsvReply;
	private String vrsvStatus;
	private String bTripDepart;
	private String bTripArrival;
	private String vehicleModel;
	private String vehicleSize;
	
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
        }
    }

}
