package com.brs.sun.model.dao;

import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.brs.sun.dto.response.EDocLineResponseDTO;
import com.brs.sun.vo.EDocLineVo;
import com.brs.sun.vo.EDocVo;

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
	public boolean updateEDoc(EDocVo vo) {
		return (template.update(NS + "updateEDoc", vo) > 0) ? true : false;
	}
	
	@Override
	public boolean deleteAppList(EDocVo vo) {
		return (template.delete(NS + "deleteAppList", vo) > 0) ? true : false;
	}
	
	@Override
	public boolean insertEDocLine(List<EDocLineVo> appList) {
		return (template.insert(NS + "insertEDocLine", appList) > 0) ? true : false;
	}
	
	@Override
	public boolean updateMyAppStatus(EDocVo vo) {
		return (template.update(NS + "updateMyAppStatus", vo) > 0) ? true : false;
	}
	
	@Override
	public EDocVo selectTempDocDetail(int edocCode) {
		return template.selectOne(NS + "selectTempDocDetail", edocCode);
	}
	
	@Override
	public EDocVo selectDocDetail(int edocCode) {
		return template.selectOne(NS + "selectDocDetail", edocCode);
	}
	
	@Override
	public List<EDocLineResponseDTO> selectEDocLine(int edocCode) {
		return template.selectList(NS + "selectEDocLine", edocCode);
	}
	
	@Override
	public boolean appSuccess(Map<String, Object> map) {
		return (template.update(NS + "appSuccess", map) > 0) ? true : false;
	}
	
	@Override
	public boolean appRejecct(Map<String, Object> map) {
		return (template.update(NS + "appRejecct", map) > 0) ? true : false;
	}
	
	@Override
	public boolean updateSuccessDocStatus(int edocCode) {
		return (template.update(NS + "updateSuccessDocStatus", edocCode) > 0) ? true : false;
	}
	
	@Override
	public boolean updateCancelDocStatus(int edocCode) {
		return (template.update(NS + "updateCancelDocStatus", edocCode) > 0) ? true : false;
	}
	
	@Override
	public int appTotalCount(int edocCode) {
		return template.selectOne(NS + "appTotalCount", edocCode);
	}
	
	@Override
	public int appRemCount(int edocCode) {
		return template.selectOne(NS + "appRemCount", edocCode);
	}
}
