package com.brs.sun.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.brs.sun.model.dao.EDocDao;
import com.brs.sun.vo.EDocLineVo;
import com.brs.sun.vo.EDocVo;
import com.brs.sun.vo.EmployeeVo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EDocServiceImpl implements EDocService {

	private final EDocDao dao;
	
	@Override
	public List<EDocVo> selectAppEmp(int empCode) {
		return dao.selectAppEmp(empCode);
	}
	
	@Override
	@Transactional
	public boolean insertTransaction(EDocVo vo, List<EDocLineVo> edocLineList) {
		boolean docInsertChk = dao.insertEDoc(vo);
		for(EDocLineVo inVo : edocLineList) {
			inVo.setEdocCode(vo.getEdocCode());
		}
		if(docInsertChk) {
			boolean docLineInsertChk = dao.insertEDocLine(edocLineList);
			return docLineInsertChk;
		} else {
			return false;
		}
	}
}
