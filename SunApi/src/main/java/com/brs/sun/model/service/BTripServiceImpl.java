package com.brs.sun.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.brs.sun.model.dao.BTripDao;
import com.brs.sun.vo.BTripVo;
import com.brs.sun.vo.CoWorkVo;
import com.brs.sun.vo.VehicleReservationVo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BTripServiceImpl implements BTripService {
	
	private final BTripDao dao;
	
	@Override
	public List<BTripVo> getMyBTrip(String empCode) {
		return dao.getMyBTrip(empCode);
	}

	@Override
	public BTripVo getOneBTrip(String bTripCode, String empCode) {
		return dao.getOneBTrip(bTripCode, empCode);
	}

	@Override
	public VehicleReservationVo getMyVehicleRsv(String bTripCode, String empCode) {
		return dao.getMyVehicleRsv(bTripCode, empCode);
	}

	@Override
	public int insertBTrip(BTripVo vo) {
		return dao.insertBTrip(vo);
	}

	@Override
	public int insertVehicleRsv(VehicleReservationVo vo) {
		return dao.insertVehicleRsv(vo);
	}
	
	@Transactional
	@Override
	public int insertBTripVRsv(BTripVo vo, VehicleReservationVo vo2) {
		int b = dao.insertBTrip(vo);
		int v = dao.insertVehicleRsv(vo2);
		if((b+v)==2) {
			return 1;
		}
		return 0;
	}

	@Override
	public List<VehicleReservationVo> getAllVehicleRsv(int first, int last, String startDate, String endDate) {
		return dao.getAllVehicleRsv(first, last, startDate, endDate);
	}

	@Override
	public List<CoWorkVo> searchCoWork(int first, int last, String cowName, String cowAddress) {
		return dao.searchCoWork(first, last, cowName, cowAddress);
	}

	@Override
	public int countCoWork(String cowName, String cowAddress) {
		return dao.countCoWork(cowName, cowAddress);
	}

}
