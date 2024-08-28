package com.brs.sun.model.dao;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.brs.sun.vo.MeetRoomVo;
import com.brs.sun.vo.MrReservationVo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MrReservationDaoImpl implements MrReservationDao {

	private final SqlSessionTemplate template;
	
	private final String NS = "com.brs.sun.model.dao.MrReservationDao.";
	
	@Override
	public List<MrReservationVo> selectReservationList() {
		return template.selectList(NS + "selectReservationList");
	}
	
	@Override
	public MrReservationVo selectReservationDetail(int mrrCode) {
		return template.selectOne(NS + "selectReservationDetail", mrrCode);
	}
	
	@Override
	public int selectOverlap(MrReservationVo vo) {
		return template.selectOne(NS + "selectOverlap", vo);
	}
	
	@Override
	public List<MeetRoomVo> selectMeetRoom() {
		return template.selectList(NS + "selectMeetRoom");
	}

	@Override
	public boolean insertReservation(MrReservationVo vo) {
		return (template.insert(NS + "insertReservation", vo) > 0) ? true : false;
	}
	
	@Override
	public boolean deleteReservation(int mrrCode) {
		return (template.delete(NS + "deleteReservation", mrrCode) > 0) ? true : false;
	}
}
