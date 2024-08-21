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
	@Transactional
	public boolean dayOffTransaction(int empCode, Map<String, Object> map) {
		DayOffVo dayOffCount = dao.selectDayOff(empCode);
		DayOffVo vo = DayOffVo.builder()
								.dayoffLeft(dayOffCount.getDayoffLeft())
								.build();
		int dayOff = (int) map.get("dayOff");
		if(vo.getDayoffLeft() - dayOff < 0) {
			throw new IllegalArgumentException("잔여 휴가가 부족합니다");
		}

		boolean chk = dao.updateDayOff(map);
		return chk;	
	}
}
