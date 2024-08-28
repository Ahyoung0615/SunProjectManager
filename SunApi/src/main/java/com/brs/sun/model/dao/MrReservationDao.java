package com.brs.sun.model.dao;

import java.util.List;

import com.brs.sun.vo.MeetRoomVo;
import com.brs.sun.vo.MrReservationVo;

public interface MrReservationDao {

	List<MrReservationVo> selectReservationList();
	
	MrReservationVo selectReservationDetail(int mrrCode);
	
	int selectOverlap(MrReservationVo vo);
	
	List<MeetRoomVo> selectMeetRoom();
	
	boolean insertReservation(MrReservationVo vo);
	
	boolean deleteReservation(int mrrCode);
}
