package com.brs.sun.model.dao;

import java.util.List;
import java.util.Map;

import com.brs.sun.dto.request.BTripRequestDTO;
import com.brs.sun.dto.response.VehicleRentDTO;
import com.brs.sun.vo.BTripVo;
import com.brs.sun.vo.CoWorkVo;
import com.brs.sun.vo.VehicleReservationVo;

public interface BTripDao {
	
	public List<BTripVo> getMyBTrip(String empCode);

	public BTripVo getOneBTrip(String bTripCode, String empCode);
	
	public List<VehicleReservationVo> getMyVehicleRsv(String bTripCode, String empCode);
	
	public int insertBTrip(BTripVo vo);
	
	public int insertVehicleRsv(VehicleReservationVo vo);
	
	public List<VehicleRentDTO> getAllVehicleRsv(int first, int last, String startDate, String endDate);
	
	public List<CoWorkVo> searchCoWork(int first, int last, String cowName, String cowAddress);
	
	public int countCoWork(String cowName, String cowAddress);
	
	public int countVehicleRsv(String startDate, String endDate);
	
	public List<Map<String, Object>>getAvailableVehicles(String startDate, String endDate);
	
	public int updateVehicleRsrvYes(String vrsvCode);
	
	public int updateVehicleRsrvNo(String vrsvCode, String vrsvReply);
	
	public VehicleRentDTO getOneVehicleRsv(String vrsvCode);
	
	public int insertReVehicleRsc(VehicleRentDTO requestDto);
}

