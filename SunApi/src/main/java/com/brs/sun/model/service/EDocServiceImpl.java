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
    public boolean updateTempEDoc(EDocVo vo, List<EDocLineVo> edocLineList) {
        // 문서를 업데이트합니다.
        if (!dao.updateTempEDoc(vo)) {
            return false;
        }

        // 각 edocLine에 edocCode를 설정합니다.
        edocLineList.forEach(eDocLineVo -> eDocLineVo.setEdocCode(vo.getEdocCode()));

        // 기존 결재 라인을 삭제합니다. 실패 시 false 반환
        if (!dao.deleteAppList(vo)) {
            return false;
        }

        // 새로운 결재 라인을 삽입하고 결과를 반환합니다.
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
	public boolean updateSuccessDocStatus(int edocCode) {
		return dao.updateSuccessDocStatus(edocCode);
	}
	
	@Override
	public int chkApp(int edocCode) {
		int totalApp = dao.appTotalCount(edocCode);
		int remApp = dao.appRemCount(edocCode);
		return totalApp - remApp;
	}
	
}
