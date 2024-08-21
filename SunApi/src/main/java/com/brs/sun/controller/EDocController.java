package com.brs.sun.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.dto.request.VacationRequestDTO;
import com.google.gson.JsonObject;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/edoc")
@RequiredArgsConstructor
public class EDocController {

	@PostMapping("/insertVacation")
	public String insertVacation(@RequestBody VacationRequestDTO docData) {
		/*
		 *  startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD 형식
            endDate: endDate.toISOString().split('T')[0],   // YYYY-MM-DD 형식
            reason,
            weekdayCount,
            approvers: selectedApprovers.map(approver => approver.empCode) // 결재자 목록
		 */
		log.info("docData: {}", docData);
		
		JsonObject jsonContent = new JsonObject();
		jsonContent.addProperty("startDate", docData.getStartDate());
		jsonContent.addProperty("endDate", docData.getEndDate());
		jsonContent.addProperty("reason", docData.getReason());
		log.info("jsonData: {}", jsonContent.toString());
		
		List<Integer> approvers = docData.getApprovers();
		log.info("appList: {}", approvers);
		
		
		
		return "ok";
	}
}
