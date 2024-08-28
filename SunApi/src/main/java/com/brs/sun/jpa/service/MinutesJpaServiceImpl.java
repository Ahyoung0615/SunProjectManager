package com.brs.sun.jpa.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.brs.sun.jpa.entity.MinutesEntity;
import com.brs.sun.jpa.repository.MinutesRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MinutesJpaServiceImpl implements MinutesJpaService {
	
	private final MinutesRepository repository;
	
	@Override
	public Page<MinutesEntity> getMyMinutesList(Integer empCode, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		return repository.getMyMinutesList(empCode, pageable);
	}

	@Override
	public MinutesEntity findByMinutesCode(Long minutesCode) {
		return repository.findByMinutesCode(minutesCode);
	}

	@Override
	public MinutesEntity saveMinutes(MinutesEntity minutes) {
		return repository.save(minutes);
	}
	
}
