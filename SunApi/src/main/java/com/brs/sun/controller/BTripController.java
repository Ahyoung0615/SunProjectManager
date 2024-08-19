package com.brs.sun.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.model.service.BTripService;
import com.brs.sun.vo.BTripVo;
import com.brs.sun.vo.CoWorkVo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class BTripController {
	
	private final BTripService service;
	
	@GetMapping("/btrip/{empCode}")
	public List<BTripVo> getMyBTrip(@PathVariable String empCode){
		log.info("getMyBTrip 요청 사원번호 : {}", empCode);
		return service.getMyBTrip(empCode);
	}
	
	@GetMapping("/btripDetail/{btripCode}")
	public BTripVo getOneBTrip(@PathVariable("btripCode") String bTripCode,
	                           @RequestParam String empCode) {
		log.info("getOneBTrip 요청 empCode : {}", empCode);
		log.info("getOneBTrip 요청 bTripCode : {}", bTripCode);
	    return service.getOneBTrip(bTripCode, empCode);
	}
	
	@GetMapping("/cowork")
	public List<CoWorkVo> searchCoWork(
	    @RequestParam(defaultValue = "1") int first,
	    @RequestParam(defaultValue = "5") int last,
	    @RequestParam(required = false) String cowName,
	    @RequestParam(required = false) String cowAddress) {
		log.info("searchCoWork 이름검색 cowName : {}", cowName);
		log.info("searchCoWork 주소검색 coAddress : {}", cowAddress);
	    return service.searchCoWork(first, last, cowName, cowAddress);
	}




}
