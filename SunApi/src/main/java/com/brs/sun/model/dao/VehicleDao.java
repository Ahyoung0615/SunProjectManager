package com.brs.sun.model.dao;

import java.util.List;

import com.brs.sun.vo.RepairVo;
import com.brs.sun.vo.VehicleVo;

public interface VehicleDao {
	
	public List<VehicleVo> getAllVehicle(int first, int last, String vehicleType);

	public VehicleVo getOneVehicle(String vehicleCode);

	public List<RepairVo> getAllRepair(String vehicleCode);

	public int insertVehicle(VehicleVo vo);

	public int updateVehicleImage(String vehicleCode, String vehicleImg);

	public int updateVehicleStatus(String vehicleCode, String vehicleStatus);

	public int deleteVehicle(String vehicleCode);
	
	public int insertRepair(RepairVo vo);
	
	public int updateRepairStatusO(String RepairCode);

	public int updateVehicleStatusR();
	
	public int updateVehicleStatusI(String RepairCode);
}
