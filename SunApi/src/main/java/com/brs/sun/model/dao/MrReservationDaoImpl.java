package com.brs.sun.model.dao;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

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

}
