package com.brs.sun.model.service;

import java.util.List;

import com.brs.sun.vo.MrReservationVo;

public interface MrReservationService {

	List<MrReservationVo> selectReservationList();
	
	MrReservationVo selectReservationDetail(int mrrCode);
}
