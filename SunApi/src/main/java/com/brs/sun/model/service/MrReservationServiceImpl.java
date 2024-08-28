package com.brs.sun.model.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.brs.sun.model.dao.MrReservationDao;
import com.brs.sun.vo.MeetRoomVo;
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
	
	@Override
	public int selectOverlap(MrReservationVo vo) {
		return dao.selectOverlap(vo);
	}
	
	@Override
	public List<MeetRoomVo> selectMeetRoom() {
		return dao.selectMeetRoom();
	}
	
	@Override
	public boolean insertReservation(MrReservationVo vo) {
		return dao.insertReservation(vo);
	}
	
	@Override
	public boolean deleteReservation(int mrrCode) {
		return dao.deleteReservation(mrrCode);
	}
}
