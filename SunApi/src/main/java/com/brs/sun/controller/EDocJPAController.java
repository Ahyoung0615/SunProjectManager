package com.brs.sun.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.dto.response.AppEDocListResponseDTO;
import com.brs.sun.dto.response.EDocListRespopnseDTO;
import com.brs.sun.dto.response.EmployeeInfoResponseDTO;
import com.brs.sun.jpa.entity.EDocEntity;
import com.brs.sun.jpa.service.EDocJpaService;
import com.brs.sun.model.service.EDocService;
import com.brs.sun.vo.EDocVo;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "전자결재 JPA Controller", description = "전자결재 JPA Controller")
@RestController
@RequestMapping("/api/jpa/edoc")
@RequiredArgsConstructor
public class EDocJPAController {

	private final EDocJpaService jpaService;
	
	private final EDocService docService;
	
	/**
	 * 페이지 객체로 화면에 전달
	 * @param status
	 * @param page
	 * @param size
	 * @return 리스트 전달
	 */
	// Swagger
	@Operation(summary = "발신함 리스트", description = "상태(결재중 A, 결재 완료 S, 반려 R, 회수 C) 에 따른 리스트 전달")
	@Parameters({
		@Parameter(name = "status", description = "문서 상태", required = true),
		@Parameter(name = "empCode", description = "로그인 한 사원 코드", required = true),
		@Parameter(name = "page", description = "현재 페이지"),
		@Parameter(name = "size", description = "한 페이지에 보여질 리스트 개수")
	})
	@ApiResponse(responseCode = "200", description = "상태 코드에 알맞는 리스트 10개씩 반환", content = @Content(schema = @Schema(implementation = Page.class)))
	@GetMapping("/eDocList")
	public Page<EDocListRespopnseDTO> selectEdocByStatus(@RequestParam String status, 
	                                           @RequestParam Integer empCode,
	                                           @RequestParam(defaultValue = "0") int page, 
	                                           @RequestParam(defaultValue = "10") int size){
	    if (page < 0) {
	        throw new IllegalArgumentException("Page index must not be less than zero");
	    }
	    return jpaService.docSelect(status, empCode, page, size);
	}
	
	@Operation(summary = "수신함 리스트", description = "상태(결재중: A, 결재완료: S, 반려: R)에 따른 수신 리스트 반환")
	@Parameters({
		@Parameter(name = "eDocStatus", description = "문서 상태", required = true),
		@Parameter(name = "empCode", description = "로그인 한 사원 코드", required = true),
		@Parameter(name = "page", description = "현재 페이지"),
		@Parameter(name = "size", description = "한 페이지에 보여질 리스트 개수")
	})
	@ApiResponse(responseCode = "200", description = "상태 코드에 해당하는 리스트 10개씩 반환", content = @Content(schema = @Schema(implementation = Page.class)))
	@GetMapping("/appDocList")
	public Page<AppEDocListResponseDTO> appEdocList(
										@RequestParam String eDocStatus,
										@RequestParam int empCode,
										@RequestParam(defaultValue = "0") int page,
			   							@RequestParam(defaultValue = "10") int size){
		System.out.println("status : " + eDocStatus);
		List<Integer> filteredEdocCodeIds = new ArrayList<Integer>();
		List<EDocVo> edocCodeList = new ArrayList<EDocVo>();
		if(eDocStatus.equals("A")) {
			edocCodeList = docService.selectAppEmp(empCode);// 내가 결재할 코드
		}else if(eDocStatus.equals("S")) {
			edocCodeList = docService.selectMyAppSuccessList(empCode);// 내가 결재한 코드
		}else if(eDocStatus.equals("R")){
			edocCodeList = docService.selectMyAppRejectList(empCode);// 내가 반려한 코드
		}
		
		for (EDocVo eDocVo : edocCodeList) {
			filteredEdocCodeIds.add(eDocVo.getEdocCode());
		}
		if (page < 0) {
	        throw new IllegalArgumentException("Page index must not be less than zero");
	    }
		return jpaService.edocAppList(empCode, filteredEdocCodeIds, eDocStatus, page, size);
	}
	
	@Operation(summary = "임시 저장 문서 리스트", description = "임시 저장(T) 상태인 문서 리스트 반환")
	@Parameters({
		@Parameter(name = "empCode", description = "로그인 한 사원 코드", required = true),
		@Parameter(name = "page", description = "현재 페이지"),
		@Parameter(name = "size", description = "한 페이지에 보여질 리스트 개수")
	})
	@ApiResponse(responseCode = "200", description = "해당 사번 코드로 기안된 임시 저장 리스트 10개씩 반환", content = @Content(schema = @Schema(implementation = Page.class)))
	@GetMapping("/eDocTempList")
	public Page<EDocEntity> selectEDocTemp(@RequestParam Integer empCode,
											   @RequestParam(defaultValue = "0") int page,
											   @RequestParam(defaultValue = "10") int size){
		if (page < 0) {
	        throw new IllegalArgumentException("Page index must not be less than zero");
	    }
		return jpaService.docTempSelect(empCode, page, size);
	}
	
	@Operation(summary = "사원 정보 조회", description = "해당 사번의 사원 정보 조회")
	@Parameter(name = "empCode", description = "사원 정보가 필요한 사원 코드")
	@ApiResponse(responseCode = "200", description = "사번, 이름, 부서 코드, 직급 코드 반환", content = @Content(mediaType = "application/json", schema = @Schema(implementation = EmployeeInfoResponseDTO.class)))
	@GetMapping("/employeeInfo")
	public EmployeeInfoResponseDTO employeeInfo(@RequestParam Integer empCode) {
		return jpaService.employeeInfo(empCode);
	}
}
