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

import com.brs.sun.dto.response.ApproverEmployeeResponse;
import com.brs.sun.jpa.entity.MinutesEntity;
import com.brs.sun.jpa.service.MinutesJpaService;
import com.brs.sun.model.service.JsTreeService;
import com.brs.sun.vo.EmployeeVo;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "회의록 Controller", description = "회의록 MyBatis CRUD Controller")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MinutesController {
	
	private final MinutesJpaService service;
	private final JsTreeService jsService;
	
	 @Operation(summary = "회의록 리스트 조회", description = "특정 사번(empCode)을 기반으로 회의록 목록을 페이징 처리하여 조회합니다.")
	    @ApiResponses({
	        @ApiResponse(responseCode = "200", description = "성공적으로 회의록 목록을 가져왔습니다.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = MinutesEntity.class))),
	        @ApiResponse(responseCode = "400", description = "잘못된 요청입니다."),
	        @ApiResponse(responseCode = "500", description = "서버 에러입니다.")
	    })
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
	
	 @Operation(summary = "회의록 상세 조회", description = "회의록 코드를 기반으로 특정 회의록의 상세 정보를 조회합니다.")
	    @ApiResponses({
	        @ApiResponse(responseCode = "200", description = "성공적으로 회의록 정보를 가져왔습니다.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = MinutesEntity.class))),
	        @ApiResponse(responseCode = "404", description = "해당 회의록 정보를 찾을 수 없습니다."),
	        @ApiResponse(responseCode = "500", description = "서버 에러입니다.")
	    })
	@GetMapping("/minutesDetail/{minutesCode}")
	public MinutesEntity findByMinutesCode(@PathVariable Long minutesCode) {
		log.info("findByMinutesCode 요청 회의록번호 : {}", minutesCode);
		return service.findByMinutesCode(minutesCode);
	}
	
	 @Operation(summary = "회의록 저장", description = "새로운 회의록을 추가합니다.")
	    @ApiResponses({
	        @ApiResponse(responseCode = "200", description = "회의록이 성공적으로 저장되었습니다.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = MinutesEntity.class))),
	        @ApiResponse(responseCode = "400", description = "잘못된 요청입니다."),
	        @ApiResponse(responseCode = "500", description = "서버 에러입니다.")
	    })
	@PostMapping("/insertMinutes")
	public MinutesEntity saveMinutes(@RequestBody MinutesEntity minutes) {
		log.info("저장할 MinutesEntity 정보 : {}", minutes);
		return service.saveMinutes(minutes);
	}
	
	 @Operation(summary = "회의 참석자 정보 조회", description = "선택된 참석자 리스트를 기반으로 회의 참석자 정보를 조회합니다.")
	    @ApiResponses({
	        @ApiResponse(responseCode = "200", description = "참석자 정보를 성공적으로 가져왔습니다.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = EmployeeVo.class))),
	        @ApiResponse(responseCode = "400", description = "잘못된 요청입니다."),
	        @ApiResponse(responseCode = "500", description = "서버 에러입니다.")
	    })
	@PostMapping("/mintesAttendense")
	public List<ApproverEmployeeResponse> getApprovers(@RequestBody List<String> choiceList) {
	    log.info("choiceArr: {}", choiceList);
	    
		List<ApproverEmployeeResponse> approverList = jsService.getApprovers(choiceList);

		return approverList;
	}
}
