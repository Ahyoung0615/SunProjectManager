package com.brs.sun.jpa.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.brs.sun.dto.response.AppEDocListResponseDTO;
import com.brs.sun.dto.response.EDocListRespopnseDTO;
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
	public Page<EDocListRespopnseDTO> docSelect(String status, Integer empCode, int page, int size) {
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
	public Page<AppEDocListResponseDTO> edocAppList(int empCode, List<Integer> eDocCode, String eDocStatus, int page, int size) {
		List<EDocVo> edocCodeList = new ArrayList<EDocVo>();
		if(eDocStatus.equals("A")) {
			edocCodeList = docService.selectAppEmp(empCode);// 내가 결재할 코드
		}else if(eDocStatus.equals("S")) {
			edocCodeList = docService.selectMyAppSuccessList(empCode);// 내가 결재한 코드
		}else if(eDocStatus.equals("R")){
			edocCodeList = docService.selectMyAppRejectList(empCode);// 내가 반려한 코드
		}
		Pageable pageable = PageRequest.of(page, size);
		for (EDocVo employeeVo : edocCodeList) {
			eDocCode.add(employeeVo.getEdocCode());
		}
		return repository.edocAppList(eDocCode, eDocStatus, pageable);
	}
}
