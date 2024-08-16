package com.brs.sun.controller;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.jpa.entity.EDocEntity;
import com.brs.sun.jpa.service.EDocJpaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/edoc")
@RequiredArgsConstructor
public class EDocController {

	private final EDocJpaService service;
	
	/**
	 * 페이지 객체로 화면에 전달
	 * @param status
	 * @param page
	 * @param size
	 * @return 리스트 전달
	 */
	@GetMapping("/eDocList")
	public Page<EDocEntity> selectEdocByStatus(@RequestParam String status, 
											   @RequestParam(defaultValue = "0") int page, 
											   @RequestParam(defaultValue = "10") int size){
		return service.docSelect(status, page, size);
	}
}
