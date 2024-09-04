package com.brs.sun.model.dao;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.brs.sun.dto.request.EmpSigFileRequest;
import com.brs.sun.dto.response.EDocLineResponseDTO;
import com.brs.sun.vo.EDocFileVo;
import com.brs.sun.vo.EDocLineVo;
import com.brs.sun.vo.EDocVo;
import com.brs.sun.vo.EmployeeVo;

public interface EDocDao {

	List<EmployeeVo> selectEmployeeSignatures(List<Integer> empCodes);
	
	List<EDocVo> selectAppEmp(int empCode);
	
	List<EDocVo> selectMyAppSuccessList(int empCode);
	
	List<EDocVo> selectMyAppRejectList(int empCode);
	
	boolean insertEDoc(EDocVo vo);
	
	boolean insertEDocFile(int edocCode, String efileName);
	
	boolean insertEDocLine(List<EDocLineVo> vo);
	
	boolean updateMyAppStatus(EDocVo vo);
	
	boolean updateEDoc(EDocVo vo);
	
	boolean updateEDocFile(int edocCode, String efileName);
	
	boolean deleteAppList(EDocVo vo);
	
	EDocVo selectTempDocDetail(int edocCode);
	
	EDocVo selectDocDetail(int edocCode);
	
	EDocFileVo selectDocFile(int edocCode);
	
	List<EDocLineResponseDTO> selectEDocLine(int edocCode);
	
	boolean appSuccess(Map<String, Object> map);
	
	boolean appRejecct(EDocVo vo);
	
	boolean updateDocReply(EDocVo vo);
	
	boolean updateSuccessDocStatus(int edocCode);
	
	boolean updateCancelDocStatus(int edocCode);
	
	boolean updateRejectDocStatus(EDocVo vo);
	
	// 전체 결재자 수
	int appTotalCount (int edocCode);
	
	// 남은 결재자 수
	int appRemCount (int edocCode);
	
	// 사인 이미지 업데이트
	boolean updateEmpSig(int empCode, String empSig);
}