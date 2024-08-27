package com.brs.sun.model.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.brs.sun.model.dao.MrReservationDao;
import com.brs.sun.vo.MrReservationVo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MrReservationServiceImpl implements MrReservationService {

	private final MrReservationDao dao;
	
	@Override
	public List<MrReservationVo> selectReservationList() {
		return dao.selectReservationList();
	}

	@Override
	public MrReservationVo selectReservationDetail(int mrrCode) {
		return dao.selectReservationDetail(mrrCode);
	}
}
