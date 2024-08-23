package com.brs.sun.model.service;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.brs.sun.model.dao.DayOffDao;
import com.brs.sun.vo.DayOffVo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DayOffServiceImpl implements DayOffService {

	private final DayOffDao dao; 
	
	@Override
	public DayOffVo selectDayOff(int empCode) {
		return dao.selectDayOff(empCode);
	}
	
	@Override
	public boolean updateDayOff(Map<String, Object> map) {
		return dao.updateDayOff(map);
	}
}
