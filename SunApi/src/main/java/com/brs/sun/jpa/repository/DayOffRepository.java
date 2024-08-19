package com.brs.sun.jpa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.brs.sun.jpa.entity.DayOffEntity;

@Repository
public interface DayOffRepository extends JpaRepository<DayOffEntity, Long>{
	
	/**
	 * 사원 번호를 통한 개인 연차 조회
	 * @param empCode
	 * @return DayOffVo
	 */
	@Query("SELECT d FROM DayOffEntity d WHERE d.empCode = :empCode")
	DayOffEntity findByEmpCode(Long empCode);
}
