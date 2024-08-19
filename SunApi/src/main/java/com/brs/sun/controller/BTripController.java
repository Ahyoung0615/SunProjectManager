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
import com.brs.sun.vo.PagingVo;

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
	public PagingVo<CoWorkVo> searchCoWork(
	    @RequestParam(defaultValue = "1") int page,
	    @RequestParam(defaultValue = "5") int countList,
	    @RequestParam(required = false) String cowName,
	    @RequestParam(required = false) String cowAddress) {

	    // 전체 게시글 수 조회
	    int totalCount = service.countCoWork(cowName, cowAddress);

	    // 페이징 정보 생성
	    PagingVo<CoWorkVo> paging = new PagingVo<>(page, countList, totalCount, 10);

	    // 게시글 목록 조회
	    List<CoWorkVo> results = service.searchCoWork((page - 1) * countList + 1, page * countList, cowName, cowAddress);

	    // 게시글 목록을 PagingVo 객체에 설정
	    paging.setContent(results);

	    // 결과 반환
	    return paging;
	}

}
