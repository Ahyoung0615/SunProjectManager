package com.brs.sun.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.dto.response.AppEDocListResponseDTO;
import com.brs.sun.dto.response.EDocDetailResponseDTO;
import com.brs.sun.dto.response.EmployeeInfoResponseDTO;
import com.brs.sun.jpa.entity.EDocEntity;
import com.brs.sun.jpa.service.EDocJpaService;
import com.brs.sun.model.service.EDocService;
import com.brs.sun.vo.EDocVo;

import lombok.RequiredArgsConstructor;

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
	@GetMapping("/eDocList")
	public Page<EDocEntity> selectEdocByStatus(@RequestParam String status, 
	                                           @RequestParam Integer empCode,
	                                           @RequestParam(defaultValue = "0") int page, 
	                                           @RequestParam(defaultValue = "10") int size){
	    if (page < 0) {
	        throw new IllegalArgumentException("Page index must not be less than zero");
	    }
	    return jpaService.docSelect(status, empCode, page, size);
	}
	
	@GetMapping("/appDocList")
	public Page<AppEDocListResponseDTO> appEdocList(@RequestParam int empCode,
										@RequestParam(defaultValue = "0") int page,
			   							@RequestParam(defaultValue = "10") int size){
		List<Integer> filteredEdocCodeIds = new ArrayList<Integer>();
		List<EDocVo> edocCodeList = docService.selectAppEmp(empCode);// 내가 결제할 코드
		for (EDocVo eDocVo : edocCodeList) {
			filteredEdocCodeIds.add(eDocVo.getEdocCode());
		}
		if (page < 0) {
	        throw new IllegalArgumentException("Page index must not be less than zero");
	    }
		return jpaService.edocAppList(empCode, filteredEdocCodeIds, page, size);
	}
	
	@GetMapping("/eDocTempList")
	public Page<EDocEntity> selectEDocTemp(@RequestParam Integer empCode,
											   @RequestParam(defaultValue = "0") int page,
											   @RequestParam(defaultValue = "10") int size){
		if (page < 0) {
	        throw new IllegalArgumentException("Page index must not be less than zero");
	    }
		return jpaService.docTempSelect(empCode, page, size);
	}
	
	@GetMapping("/employeeInfo")
	public EmployeeInfoResponseDTO employeeInfo(@RequestParam Integer empCode) {
		return jpaService.employeeInfo(empCode);
	}
}
