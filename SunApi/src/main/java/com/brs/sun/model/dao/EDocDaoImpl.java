package com.brs.sun.model.dao;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.brs.sun.vo.EDocLineVo;
import com.brs.sun.vo.EDocVo;
import com.brs.sun.vo.EmployeeVo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class EDocDaoImpl implements EDocDao {

	private final SqlSessionTemplate template;
	
	private final String NS = "com.brs.sun.model.dao.EDocDao.";
	
	@Override
	public List<EDocVo> selectAppEmp(int empCode) {
		return template.selectList(NS + "selectAppEmp", empCode);
	}
	
	@Override
	public boolean insertEDoc(EDocVo vo) {
		return (template.insert(NS + "insertEDoc", vo) > 0) ? true : false;
	}

	@Override
	public boolean insertEDocLine(List<EDocLineVo> appList) {
		return (template.insert(NS + "insertEDocLine", appList) > 0) ? true : false;
	}
}
