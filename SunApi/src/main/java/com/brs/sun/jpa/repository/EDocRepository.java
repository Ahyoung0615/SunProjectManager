package com.brs.sun.jpa.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.brs.sun.dto.response.AppEDocListResponseDTO;
import com.brs.sun.dto.response.EDocDetailResponseDTO;
import com.brs.sun.dto.response.EmployeeInfoResponseDTO;
import com.brs.sun.jpa.entity.EDocEntity;

@Repository
public interface EDocRepository extends JpaRepository<EDocEntity, Long> {

	/**
	 * 상태에 따른 문서 리스트 조회
	 * 
	 * @param status
	 * @param pageable
	 * @return 상태에 따른 리스트들을 페이지 객체로 전달
	 */
//	@Query("select e from EDocEntity e where e.eDocStatus = :status and e.employee.empCode = :empCode order by e.eDocCode desc")
	@Query(" select new com.brs.sun.dto.response.EDocListRespopnseDTO(e.eDocCode, e.eDocTitle, e.eDocDate, e.eDocStatus) "
			+ " from EDocEntity e "
			+ " where e.eDocStatus = :status and e.employee.empCode = :empCode order by e.eDocCode desc ")
	Page<EDocEntity> eDocSelectByStatus(String status, Integer empCode, Pageable pageable);

	/**
	 * session storage 에서 받은 id로 전자결재 임시저장 리스트 페이징 처리 반환
	 * 
	 * @param empCode
	 * @param pageable
	 * @return 임시저장 리스트 페이징 반환
	 */
	@Query(" select new com.brs.sun.dto.response.TempEDocListResponseDTO(e.eDocCode, e.eDocTitle, e.eDocDate) "
			+ " from EDocEntity e "
			+ " where e.eDocStatus = 'T' and e.employee.empCode = :empCode order by e.eDocCode desc ")
	Page<EDocEntity> eDocTempSelect(Integer empCode, Pageable pageable);

	/**
	 * session storage id 값으로 사원 정보 조회
	 * 
	 * @param empCode
	 * @return Employee 정보
	 */
	@Query("SELECT new com.brs.sun.dto.response.EmployeeInfoResponseDTO(e.empCode, e.empName, e.deptCode, e.jobCode) "
			+ "FROM EmployeeEntity e WHERE e.empCode = :empCode")
	EmployeeInfoResponseDTO findEmployeeInfoByEmpCode(@Param("empCode") Integer empCode);

	/**
	 * 결재 리스트에 내가 결재할 차례인 문서 반환
	 * @param eDocCode
	 * @return Page<EDocEntity>
	 */
//	@Query("select e from EDocEntity e where e.eDocCode IN :eDocCode order by e.eDocCode desc")
	@Query("select new com.brs.sun.dto.response.AppEDocListResponseDTO(e.eDocCode, e.eDocTitle, e.eDocDate, emp.empName) "
		       + "from EDocEntity e join e.employee emp "
		       + "where e.eDocCode IN :eDocCode and e.eDocStatus = 'A' order by e.eDocCode desc")
	Page<AppEDocListResponseDTO> edocAppList(@Param("eDocCode") List<Integer> eDocCode, Pageable pageable);

	// JPA 에서 nativeQuery 사용 하기
//	@Query(value = "select new com.brs.sun.dto.response.AppEDocListResponseDTO(e.eDocCode, e.eDocTitle, e.eDocDate, emp.empName) "
//			+ "from edoc e "
//			+ "join employee emp on e.emp_code = emp.emp_code "
//			+ "where e.eDocCode IN :eDocCodes "
//			+ "order by e.eDocCode desc", 
//			nativeQuery = true)
//	@Query(value = "SELECT EDOC_CODE, EDOC_TITLE, EDOC_DATE, EMP_NAME "
//            + " FROM EDOC , EMPLOYEE "
//            + " WHERE EDOC.EMP_CODE = EMPLOYEE.EMP_CODE "
//            + " ORDER BY EDOC_CODE DESC ", 
//      nativeQuery = true)
//	List<Object[]> findAllEDocWithEmployee();

}
