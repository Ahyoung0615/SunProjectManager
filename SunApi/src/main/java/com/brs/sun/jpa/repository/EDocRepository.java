package com.brs.sun.jpa.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.brs.sun.jpa.entity.EDocEntity;

@Repository
public interface EDocRepository extends JpaRepository<EDocEntity, Long>{

	/**
	 * 상태에 따른 문서 리스트 조회
	 * @param status
	 * @param pageable
	 * @return 상태에 따른 리스트들을 페이지 객체로 전달
	 */
	@Query("select e from EDocEntity e where e.eDocStatus = :status")
	Page<EDocEntity> eDocSelectByStatus(String status, Pageable pageable); 
}
