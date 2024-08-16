package com.brs.sun.jpa.service;

import org.springframework.data.domain.Page;

import com.brs.sun.jpa.entity.EDocEntity;

public interface EDocJpaService {

	/**
	 * docList Page 객체로 반환
	 * @param eDocStatus
	 * @param page
	 * @param size
	 * @return
	 */
	Page<EDocEntity> docSelect(String eDocStatus, int page, int size);

}
