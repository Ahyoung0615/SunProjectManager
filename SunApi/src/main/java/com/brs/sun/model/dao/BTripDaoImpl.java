package com.brs.sun.model.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.brs.sun.vo.BTripVo;
import com.brs.sun.vo.CoWorkVo;
import com.brs.sun.vo.VehicleReservationVo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class BTripDaoImpl implements BTripDao {
	
	private final SqlSessionTemplate template;
	
	private final String NS = "com.brs.sun.model.dao.BTripDao.";
	
	@Override
	public List<BTripVo> getMyBTrip(String empCode) {
		return template.selectList(NS+"getMyBTrip", empCode);
	}

	@Override
	public BTripVo getOneBTrip(String bTripCode, String empCode) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("bTripCode", bTripCode);
		params.put("empCode", empCode);
		return template.selectOne(NS+"getOneBTrip", params);
	}

	@Override
	public VehicleReservationVo getMyVehicleRsv(String bTripCode, String empCode) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("bTripCode", bTripCode);
		params.put("empCode", empCode);
		return template.selectOne(NS+"getMyVehicleRsv", params);
	}

	@Override
	public int insertBTrip(BTripVo vo) {
		return template.insert(NS+"insertBTrip", vo);
	}

	@Override
	public int insertVehicleRsv(VehicleReservationVo vo) {
		return template.insert(NS+"insertVehicleRsv", vo);
	}

	@Override
	public List<VehicleReservationVo> getAllVehicleRsv(int first, int last, String startDate, String endDate) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("first", first);
		params.put("last", last);
		params.put("startDate", startDate);
		params.put("endDate", endDate);
		return template.selectList(NS+"getAllVehicleRsv", params);
	}

	@Override
	public List<CoWorkVo> searchCoWork(int first, int last, String cowName, String cowAddress) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("first", first);
		params.put("last", last);
		params.put("cowName", cowName);
		params.put("cowAddress", cowAddress);
		return template.selectList(NS+"searchCoWork",params);
	}

	@Override
	public int countCoWork(String cowName, String cowAddress) {
	    Map<String, Object> params = new HashMap<>();
	    params.put("cowName", cowName);
	    params.put("cowAddress", cowAddress);
	    return template.selectOne(NS + "countCoWork", params);
	}


}
