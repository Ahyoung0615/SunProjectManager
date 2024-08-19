package com.brs.sun.jpa.service;

import org.springframework.data.domain.Page;

import com.brs.sun.jpa.entity.EDocEntity;
import com.brs.sun.jpa.entity.EDocTempEntity;

public interface EDocJpaService {

	/**
	 * docList Page 객체로 반환
	 * @param eDocStatus
	 * @param page
	 * @param size
	 * @return
	 */
	Page<EDocEntity> docSelect(String eDocStatus, Integer empCode, int page, int size);

	Page<EDocTempEntity> docTempSelect(Integer empCode, int page, int size);
}
