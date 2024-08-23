package com.brs.sun.jpa.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.brs.sun.jpa.entity.EDocEntity;
import com.brs.sun.jpa.entity.EDocTempEntity;
import com.brs.sun.jpa.entity.EmployeeEntity;

@Repository
public interface EDocRepository extends JpaRepository<EDocEntity, Long>{

	/**
	 * 상태에 따른 문서 리스트 조회
	 * @param status
	 * @param pageable
	 * @return 상태에 따른 리스트들을 페이지 객체로 전달
	 */
	@Query("select e from EDocEntity e where e.eDocStatus = :status and e.empCode = :empCode order by e.eDocCode desc")
	Page<EDocEntity> eDocSelectByStatus(String status, Integer empCode, Pageable pageable); 
	
	/**
	 * 문서 코드에 따른 상세 보기
	 * @param edocCode
	 * @return EdocEntity
	 */
	@Query("select e from EDocEntity e where e.eDocCode = :eDocCode")
	EDocEntity selectEDocDetail(Integer eDocCode);
	
	/**
	 * session storage 에서 받은 id로 전자결재 임시저장 리스트 페이징 처리 반환
	 * @param empCode
	 * @param pageable
	 * @return 임시저장 리스트 페이징 반환
	 */
	@Query("select t from EDocTempEntity t where t.empCode = :empCode order by t.edtempCode desc")
	Page<EDocTempEntity> eDocTempSelect(Integer empCode, Pageable pageable);
	
	/**
	 * session storage id 값으로 사원 정보 조회
	 * @param empCode
	 * @return Employee 정보
	 */
	@Query("select e from EmployeeEntity e where e.empCode = :empCode")
	EmployeeEntity employeeInfo(Integer empCode);
	
	/**
	 * 결재 리스트에 내가 결재할 차례인 문서 반환
	 * @param eDocCode
	 * @return Page<EDocEntity>
	 */
	@Query("select e from EDocEntity e where e.eDocCode IN :eDocCode order by e.eDocCode desc")
	Page<EDocEntity> edocAppList(List<Integer> eDocCode, Pageable pageable);
}
