package com.brs.sun.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.dto.request.BTripRequestDTO;
import com.brs.sun.model.service.BTripService;
import com.brs.sun.vo.BTripVo;
import com.brs.sun.vo.CoWorkVo;
import com.brs.sun.vo.PagingVo;
import com.brs.sun.vo.VehicleReservationVo;

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
	
	@GetMapping("/vrsvDetail/{btripCode}")
	public List<VehicleReservationVo> getMyVehicleRsv(
			@PathVariable("btripCode") String bTripCode,
            @RequestParam String empCode){
		log.info("getMyVehicleRsv 요청 empCode : {}", empCode);
		log.info("getMyVehicleRsv 요청 bTripCode : {}", bTripCode);
		return service.getMyVehicleRsv(bTripCode, empCode);
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
	
	@GetMapping("/getAllVehicleRsv")
	public PagingVo<VehicleReservationVo> getAllVehicleRsv(
			@RequestParam(defaultValue = "1") int page,
		    @RequestParam(defaultValue = "50") int countList,
		    @RequestParam(required = false) String startDate,
		    @RequestParam(required = false) String endDate ){
		log.info("startDate : {}",startDate);
		log.info("endDate : {}",endDate);
		int totalCount = service.countVehicleRsv(startDate, endDate);
		 PagingVo<VehicleReservationVo> paging = new PagingVo<>(page, countList, totalCount, 10);
		List<VehicleReservationVo> results = service.getAllVehicleRsv((page - 1) * countList + 1, page * countList, startDate, endDate);
		  paging.setContent(results);
		return paging;
	}
	
	@GetMapping("/availableVehicle")
	public List<Map<String, Object>> getAvailableVehicles(
		    @RequestParam(required = false) String startDate,
		    @RequestParam(required = false) String endDate){
		log.info("startDate : {}",startDate);
		log.info("endDate : {}",endDate);
		return service.getAvailableVehicles(startDate, endDate);
	}
	
	@PostMapping("/insertBTrip")
	public int insertBTripVRsv(@RequestBody BTripRequestDTO requestDto) {
		log.info("requestDto:{}", requestDto);
	    return service.insertBTripVRsv(requestDto);
	}


}
