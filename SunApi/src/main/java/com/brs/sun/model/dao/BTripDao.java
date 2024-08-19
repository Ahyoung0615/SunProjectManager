package com.brs.sun.model.dao;

import java.util.List;

import com.brs.sun.vo.BTripVo;
import com.brs.sun.vo.CoWorkVo;
import com.brs.sun.vo.VehicleReservationVo;

public interface BTripDao {
	
	public List<BTripVo> getMyBTrip(String empCode);

	public BTripVo getOneBTrip(String bTripCode, String empCode);
	
	public VehicleReservationVo getMyVehicleRsv(String bTripCode, String empCode);
	
	public int insertBTrip(BTripVo vo);
	
	public int insertVehicleRsv(VehicleReservationVo vo);
	
	public List<VehicleReservationVo> getAllVehicleRsv(int first, int last, String startDate, String endDate);
	
	public List<CoWorkVo> searchCoWork(int first, int last, String cowName, String cowAddress);
}
