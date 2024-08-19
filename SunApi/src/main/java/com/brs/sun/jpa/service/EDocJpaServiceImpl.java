package com.brs.sun.jpa.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.brs.sun.jpa.entity.EDocEntity;
import com.brs.sun.jpa.entity.EDocTempEntity;
import com.brs.sun.jpa.entity.EmployeeEntity;
import com.brs.sun.jpa.repository.EDocRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EDocJpaServiceImpl implements EDocJpaService {

	private final EDocRepository repository;
	
	/**
	 * Page 객체로 전달
	 */
	@Override
	public Page<EDocEntity> docSelect(String status, Integer empCode, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		return repository.eDocSelectByStatus(status, empCode, pageable);
	}
	
	@Override
	public Page<EDocTempEntity> docTempSelect(Integer empCode, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		return repository.eDocTempSelect(empCode, pageable);
	}
	
	@Override
	public EmployeeEntity employeeInfo(Integer empCode) {
		return repository.employeeInfo(empCode);
	}
}
