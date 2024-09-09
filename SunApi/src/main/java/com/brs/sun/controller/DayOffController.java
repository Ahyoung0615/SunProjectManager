package com.brs.sun.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.jpa.entity.DayOffEntity;
import com.brs.sun.jpa.service.DayOffJpaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Tag(name="DayOff Controller", description = "연차관리 조회 컨트롤러")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dayOff")
public class DayOffController {
	
	private final DayOffJpaService service;
	
	@Operation(summary = "연차 조회", description = "사원 코드를 통한 개인 연차 조회")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "개인 연차 조회 성공", content = @Content(mediaType = "application/json", schema = @Schema(implementation = DayOffEntity.class))),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "500", description = "서버 에러")
	})
	@GetMapping("/{empCode}")
	public DayOffEntity getMyDayOff(@PathVariable Long empCode) {
	    log.info("연차조회 getMyDayOff empCode : {}", empCode);
	    return service.getMyDayOff(empCode);
	}


}
