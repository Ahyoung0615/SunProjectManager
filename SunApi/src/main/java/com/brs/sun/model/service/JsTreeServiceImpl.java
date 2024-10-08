package com.brs.sun.model.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.brs.sun.dto.response.ApproverEmployeeResponse;
import com.brs.sun.model.dao.JsTreeDao;
import com.brs.sun.vo.DepartmentVo;
import com.brs.sun.vo.EmployeeVo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JsTreeServiceImpl implements JsTreeService {

	private final JsTreeDao dao;

	@Override
	public List<DepartmentVo> getDept() {
		return dao.getDept();
	}

	@Override
	public List<EmployeeVo> getEmp() {
		return dao.getEmp();
	}

	@Override
	public List<ApproverEmployeeResponse> getApprovers(List<String> empCodes) {
		return ApproverEmployeeResponse.of(dao.getApprovers(empCodes));
	}
}
