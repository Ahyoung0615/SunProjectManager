package com.brs.sun.jpa.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.brs.sun.jpa.entity.EDocEntity;
import com.brs.sun.jpa.entity.EDocTempEntity;
import com.brs.sun.jpa.entity.EmployeeEntity;

public interface EDocJpaService {

	/**
	 * docList Page 객체로 반환
	 * @param eDocStatus
	 * @param page
	 * @param size
	 * @return Page<EDocEntity>
	 */
	Page<EDocEntity> docSelect(String eDocStatus, Integer empCode, int page, int size);

	/**
	 * 상세보기
	 * @param eDocCode
	 * @return EDocEntity
	 */
	EDocEntity selectEDocDetail(Integer eDocCode);
	
	/**
	 * 임시저장 리스트 Page 객체로 반환
	 * @param empCode
	 * @param page
	 * @param size
	 * @return Page<EDocTempEntity>
	 */
	Page<EDocTempEntity> docTempSelect(Integer empCode, int page, int size);
	
	/**
	 * 사원 정보 반환
	 * @param empCode
	 * @return EmployeeEntity
	 */
	EmployeeEntity employeeInfo(Integer empCode);
	
	/**
	 * 나의 결재 차례인 문서 리스트
	 * @param empCode
	 * @param eDocCode
	 * @param page
	 * @param size
	 * @return Page<EDocEntity>
	 */
	Page<EDocEntity> edocAppList(int empCode, List<Integer> eDocCode, int page, int size);
}
