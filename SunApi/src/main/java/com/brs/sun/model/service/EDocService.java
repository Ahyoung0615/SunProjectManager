package com.brs.sun.model.service;

import java.util.List;
import java.util.Map;

import com.brs.sun.dto.response.EDocDetailResponseDTO;
import com.brs.sun.dto.response.EDocLineResponseDTO;
import com.brs.sun.dto.response.TempEDocDetailResponseDTO;
import com.brs.sun.vo.EDocLineVo;
import com.brs.sun.vo.EDocVo;

public interface EDocService {

	List<EDocVo> selectAppEmp(int empCode);
	
	boolean insertTransaction(EDocVo vo, List<EDocLineVo> edocLineList);
	
	boolean updateEDoc(EDocVo vo, List<EDocLineVo> edocLineList);
	
	boolean updateMyAppStatus(EDocVo vo);

	TempEDocDetailResponseDTO selectTempDocDetail(int edocCode);
	
	EDocDetailResponseDTO selectDocDetail(int edocCode);
	
	List<EDocLineResponseDTO> selectEDocLine(int edocCode);
	
	boolean appSuccess(Map<String, Object> map);
	
	boolean appRejecct(EDocVo vo);
	
	boolean updateSuccessDocStatus(int edocCode);
	
	boolean updateCancelDocStatus(int edocCode);
	
	boolean updateRejectDocStatus(EDocVo vo);
	
	int chkApp(int edocCode);
}
