package com.brs.sun.jpa.service;

import com.brs.sun.jpa.entity.DayOffEntity;

public interface DayOffJpaService {
	
	/**
	 * empCode를 통한 연차 조회 서비스
	 * @param empCode
	 * @return DayOffEntity
	 */
	DayOffEntity getMyDayOff(Long empCode);

}
