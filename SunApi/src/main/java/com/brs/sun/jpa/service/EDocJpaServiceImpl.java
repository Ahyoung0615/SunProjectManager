package com.brs.sun.jpa.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.brs.sun.dto.response.AppEDocListResponseDTO;
import com.brs.sun.dto.response.EDocDetailResponseDTO;
import com.brs.sun.dto.response.EmployeeInfoResponseDTO;
import com.brs.sun.jpa.entity.EDocEntity;
import com.brs.sun.jpa.repository.EDocRepository;
import com.brs.sun.model.service.EDocService;
import com.brs.sun.vo.EDocVo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EDocJpaServiceImpl implements EDocJpaService {

	private final EDocRepository repository;
	
	private final EDocService docService;
	
	/**
	 * Page 객체로 전달
	 */
	@Override
	public Page<EDocEntity> docSelect(String status, Integer empCode, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		return repository.eDocSelectByStatus(status, empCode, pageable);
	}
	
	@Override
	public Page<EDocEntity> docTempSelect(Integer empCode, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		return repository.eDocTempSelect(empCode, pageable);
	}
	
	@Override
	public EmployeeInfoResponseDTO employeeInfo(Integer empCode) {
		return repository.findEmployeeInfoByEmpCode(empCode);
	}
	
	@Override
	public Page<AppEDocListResponseDTO> edocAppList(int empCode, List<Integer> eDocCode, int page, int size) {
		List<EDocVo> edocCodeList = docService.selectAppEmp(empCode);
		Pageable pageable = PageRequest.of(page, size);
		for (EDocVo employeeVo : edocCodeList) {
			eDocCode.add(employeeVo.getEdocCode());
		}
		return repository.edocAppList(eDocCode, pageable);
	}
}
