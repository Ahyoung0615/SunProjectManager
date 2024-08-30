package com.brs.sun.model.dao;

import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.brs.sun.vo.DayOffVo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DayOffDaoImpl implements DayOffDao {

	private final SqlSessionTemplate template;
	
	private final String NS = "com.brs.sun.model.dao.EDocDao.";
	
	@Override
	public DayOffVo selectDayOff(int empCode) {
		return template.selectOne(NS + "selectDayOff", empCode);
	}

	@Override
	public boolean updateDayOff(Map<String, Object> map) {
		return (template.update(NS + "updateDayOff", map) > 0) ? true : false;
	}
	
	@Override
	public boolean revertDayOff(Map<String, Object> map) {
		return (template.update(NS + "revertDayOff", map) > 0) ? true : false;
	}

}
