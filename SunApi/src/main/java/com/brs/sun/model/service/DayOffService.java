package com.brs.sun.model.service;

import java.util.Map;

import com.brs.sun.vo.DayOffVo;

public interface DayOffService {

	DayOffVo selectDayOff(int empCode);
	
	boolean updateDayOff(Map<String, Object> map);
}
