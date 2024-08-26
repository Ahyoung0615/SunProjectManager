package com.brs.sun.model.dao;

import java.util.List;
import java.util.Map;

import com.brs.sun.dto.response.EDocLineResponseDTO;
import com.brs.sun.vo.EDocLineVo;
import com.brs.sun.vo.EDocVo;

public interface EDocDao {

	List<EDocVo> selectAppEmp(int empCode);
	
	boolean insertEDoc(EDocVo vo);
	
	boolean insertEDocLine(List<EDocLineVo> vo);
	
	boolean updateMyAppStatus(EDocVo vo);
	
	boolean updateTempEDoc(EDocVo vo);
	
	boolean deleteAppList(EDocVo vo);
	
	EDocVo selectTempDocDetail(int edocCode);
	
	EDocVo selectDocDetail(int edocCode);
	
	List<EDocLineResponseDTO> selectEDocLine(int edocCode);
	
	boolean appSuccess(Map<String, Object> map);
	
	boolean updateSuccessDocStatus(int edocCode);
	
	// 전체 결재자 수
	int appTotalCount (int edocCode);
	
	// 남은 결재자 수
	int appRemCount (int edocCode);
}