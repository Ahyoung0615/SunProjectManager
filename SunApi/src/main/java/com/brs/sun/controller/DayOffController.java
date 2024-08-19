package com.brs.sun.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.jpa.entity.DayOffEntity;
import com.brs.sun.jpa.service.DayOffJpaService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dayOff")
public class DayOffController {
	
	private final DayOffJpaService service;
	
	@GetMapping("/{empCode}")
	public DayOffEntity getMyDayOff(@PathVariable Long empCode) {
	    log.info("연차조회 getMyDayOff empCode : {}", empCode);
	    return service.getMyDayOff(empCode);
	}


}
