package com.brs.sun.jpa.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.brs.sun.jpa.entity.EDocEntity;
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
	public Page<EDocEntity> docSelect(String status, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		return repository.eDocSelectByStatus(status, pageable);
	}
}