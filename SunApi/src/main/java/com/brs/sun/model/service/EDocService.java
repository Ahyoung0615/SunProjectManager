package com.brs.sun.model.service;

import java.util.List;

import com.brs.sun.model.dao.EDocDao;
import com.brs.sun.vo.EDocLineVo;
import com.brs.sun.vo.EDocVo;

public interface EDocService {

	List<EDocVo> selectAppEmp(int empCode);
	
	boolean insertTransaction(EDocVo vo, List<EDocLineVo> edocLineList);
	
}
