package com.brs.sun.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.dto.request.VacationRequestDTO;
import com.brs.sun.model.service.DayOffService;
import com.brs.sun.model.service.EDocService;
import com.brs.sun.vo.DayOffVo;
import com.brs.sun.vo.EDocLineVo;
import com.brs.sun.vo.EDocVo;
import com.google.gson.JsonObject;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/edoc")
@RequiredArgsConstructor
public class EDocController {
	
	private final DayOffService dayOffService;
	private final EDocService docService;

	@GetMapping("/getDayOff")
	public int getDayOffLeft(@RequestParam int empCode) {
		log.info("empCode 확인: {}", empCode);
		DayOffVo vo = dayOffService.selectDayOff(empCode);
		return vo.getDayoffLeft();
	}
	
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
		
		String date = String.valueOf(docData.getUploadDate());
		LocalDate updateDate = LocalDate.parse(date);
		
		JsonObject jsonContent = new JsonObject();
		jsonContent.addProperty("startDate", docData.getStartDate());
		jsonContent.addProperty("endDate", docData.getEndDate());
		jsonContent.addProperty("usedDayOff", docData.getWeekdayCount());
		jsonContent.addProperty("reason", docData.getReason());
		log.info("jsonData: {}", jsonContent.toString());
		
		List<Integer> approvers = docData.getApprovers();
		log.info("appList: {}", approvers);
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("dayOff", docData.getWeekdayCount());
		map.put("empCode", docData.getEmpCode());
		
		boolean updateDayOff = dayOffService.updateDayOff(map);
		
		if(updateDayOff) {
			EDocVo vo = EDocVo.builder()
							  .edocType(docData.getDocType())
							  .edocTitle(docData.getDocTitle())
							  .edocContent(jsonContent.toString())
							  .empCode(docData.getEmpCode())
							  .edocDate(updateDate)
							  .build();
			log.info("docCode: {}", vo.getEdocCode());
			List<EDocLineVo> edocLine = new ArrayList<EDocLineVo>();
			for(int i = 1; i < approvers.size(); i++) {
				EDocLineVo ev = new EDocLineVo();
				ev.setEmpCode(approvers.get(i));
				edocLine.add(ev);
			}
			docService.insertTransaction(vo, edocLine);
			return "ok";
		} else {
			return "fail";
		}
		
	}
}
