package com.brs.sun.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.brs.sun.dto.response.EDocDetailResponseDTO;
import com.brs.sun.dto.response.EDocLineResponseDTO;
import com.brs.sun.dto.response.TempEDocDetailResponseDTO;
import com.brs.sun.model.dao.EDocDao;
import com.brs.sun.vo.EDocLineVo;
import com.brs.sun.vo.EDocVo;

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
	
	@Override
	public boolean updateMyAppStatus(EDocVo vo) {
		return dao.updateMyAppStatus(vo);
	}
	
	@Override
	@Transactional
    public boolean updateEDoc(EDocVo vo, List<EDocLineVo> edocLineList) {
        // 문서를 업데이트
        if (!dao.updateEDoc(vo)) {
            return false;
        }

        // 각 edocLine에 edocCode를 설정
        edocLineList.forEach(eDocLineVo -> eDocLineVo.setEdocCode(vo.getEdocCode()));

        // 기존 결재 라인을 삭제. 실패 시 false 반환
        if (!dao.deleteAppList(vo)) {
            return false;
        }

        // 새로운 결재 라인을 삽입하고 결과를 반환.
        return dao.insertEDocLine(edocLineList);
    }
	
	@Override
	public TempEDocDetailResponseDTO selectTempDocDetail(int edocCode) {
		return TempEDocDetailResponseDTO.of(dao.selectTempDocDetail(edocCode));
	}
	
	@Override
	public EDocDetailResponseDTO selectDocDetail(int edocCode) {
		return EDocDetailResponseDTO.of(dao.selectDocDetail(edocCode));
	}
	
	@Override
	public List<EDocLineResponseDTO> selectEDocLine(int edocCode) {
		return dao.selectEDocLine(edocCode);
	}
	
	@Override
	public boolean appSuccess(Map<String, Object> map) {
		return dao.appSuccess(map);
	}
	
	@Override
	public boolean appRejecct(EDocVo vo) {
		return dao.appRejecct(vo);
	}
	
	@Override
	public boolean updateSuccessDocStatus(int edocCode) {
		return dao.updateSuccessDocStatus(edocCode);
	}
	
	@Override
	public boolean updateCancelDocStatus(int edocCode) {
		return dao.updateCancelDocStatus(edocCode);
	}
	
	@Override
	@Transactional
	public boolean updateRejectDocStatus(EDocVo vo) {
	    // 모든 DAO 메서드의 결과가 true일 때만 true를 반환
	    return dao.appRejecct(vo) 
	            && dao.updateDocReply(vo) 
	            && dao.updateRejectDocStatus(vo);
	}

	
	@Override
	public int chkApp(int edocCode) {
		int totalApp = dao.appTotalCount(edocCode);
		int remApp = dao.appRemCount(edocCode);
		return totalApp - remApp;
	}
	
}
