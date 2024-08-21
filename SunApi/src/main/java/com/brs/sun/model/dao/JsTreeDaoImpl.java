package com.brs.sun.model.dao;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.brs.sun.vo.DepartmentVo;
import com.brs.sun.vo.EmployeeVo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class JsTreeDaoImpl implements JsTreeDao {

	private final SqlSessionTemplate template;
	
	private final String NS = "com.brs.sun.model.dao.JsTreeDao.";
	
	@Override
	public List<DepartmentVo> getDept() {
		return template.selectList(NS + "selectDept");
	}

	@Override
	public List<EmployeeVo> getEmp() {
		return template.selectList(NS + "selectEmp");
	}
	
	@Override
	public List<EmployeeVo> getApprovers(List<String> empCodes) {
		return template.selectList(NS + "selectApprovers", empCodes);
	}

}
