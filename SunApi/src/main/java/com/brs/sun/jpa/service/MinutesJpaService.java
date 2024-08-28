package com.brs.sun.jpa.service;

import org.springframework.data.domain.Page;

import com.brs.sun.jpa.entity.MinutesEntity;

public interface MinutesJpaService {
	
	Page<MinutesEntity> getMyMinutesList(Integer empCode, int page, int size);
	
	MinutesEntity findByMinutesCode(Long minutesCode);
	
	MinutesEntity saveMinutes(MinutesEntity minutes);

}
