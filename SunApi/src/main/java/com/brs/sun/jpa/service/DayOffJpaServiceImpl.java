package com.brs.sun.jpa.service;

import org.springframework.stereotype.Service;

import com.brs.sun.jpa.entity.DayOffEntity;
import com.brs.sun.jpa.repository.DayOffRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DayOffJpaServiceImpl implements DayOffJpaService {
	
	private final DayOffRepository repository;
	
	@Override
	public DayOffEntity getMyDayOff(Long empCode) {
		return repository.findByEmpCode(empCode);
	}

}
