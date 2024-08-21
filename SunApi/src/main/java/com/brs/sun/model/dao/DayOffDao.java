package com.brs.sun.model.dao;

import java.util.Map;

import com.brs.sun.vo.DayOffVo;

public interface DayOffDao {

	DayOffVo selectDayOff(int empCode);
	
	boolean updateDayOff(Map<String, Object> map);
}
