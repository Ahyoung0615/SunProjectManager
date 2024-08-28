package com.brs.sun.jpa.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.brs.sun.jpa.entity.MinutesEntity;

@Repository
public interface MinutesRepository extends JpaRepository<MinutesEntity, Long> {

	/**
	 * 나의 회의록 목록 전체 조회
	 * @param empCode
	 * @param pageable
	 * @return MinutesEntity
	 */
	@Query("SELECT m FROM MinutesEntity m WHERE m.empCode = :empCode ORDER BY m.minutesCode DESC")
	Page<MinutesEntity> getMyMinutesList(@Param("empCode") Integer empCode, Pageable pageable);
	
	
	/**
	 * 회의 상세 조회
	 * @param minutesCode
	 * @return MinutesEntity
	 */
	@Query
	MinutesEntity findByMinutesCode(Long minutesCode);
	
	
}
