package com.brs.sun.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.jpa.entity.MinutesEntity;
import com.brs.sun.jpa.service.MinutesJpaService;
import com.brs.sun.model.service.JsTreeService;
import com.brs.sun.vo.EmployeeVo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MinutesController {
	
	private final MinutesJpaService service;
	private final JsTreeService jsService;
	
	@GetMapping("/minutesList")
	public Page<MinutesEntity> getMyMinutesList(@RequestParam Integer empCode,
	                                           @RequestParam(defaultValue = "0") int page, 
	                                           @RequestParam(defaultValue = "10") int size){
	    log.info("getMyMinutesList 회의록 요청 사번 : {}", empCode);
		if (page < 0) {
	        throw new IllegalArgumentException("Page index must not be less than zero");
	    }
	    
	    return service.getMyMinutesList(empCode, page, size);
	}
	
	@GetMapping("/minutesDetail/{minutesCode}")
	public MinutesEntity findByMinutesCode(@PathVariable Long minutesCode) {
		log.info("findByMinutesCode 요청 회의록번호 : {}", minutesCode);
		return service.findByMinutesCode(minutesCode);
	}
	
	@PostMapping("/insertMinutes")
	public MinutesEntity saveMinutes(@RequestBody MinutesEntity minutes) {
		log.info("저장할 MinutesEntity 정보 : {}", minutes);
		return service.saveMinutes(minutes);
	}
	
	@PostMapping("/mintesAttendense")
	public List<EmployeeVo> getApprovers(@RequestBody List<String> choiceList) {
	    log.info("choiceArr: {}", choiceList);
	    
	    List<EmployeeVo> approverList = jsService.getApprovers(choiceList);
	    
	    return approverList;
	}
}
