package com.brs.sun.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.brs.sun.model.dao.VehicleDao;
import com.brs.sun.vo.RepairVo;
import com.brs.sun.vo.VehicleVo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

	private final VehicleDao dao;

	@Override
	public List<VehicleVo> getAllVehicle(String vehicleType) {
		return dao.getAllVehicle(vehicleType);
	}

	@Override
	public VehicleVo getOneVehicle(String vehicleCode) {
		return dao.getOneVehicle(vehicleCode);
	}

	@Override
	public List<RepairVo> getAllRepair(String vehicleCode) {
		return dao.getAllRepair(vehicleCode);
	}

	@Override
	public int insertVehicle(VehicleVo vo) {
	    VehicleVo newVehicle = VehicleVo.builder()
	            .vehicleNo(vo.getVehicleNo())
	            .vehicleModel(vo.getVehicleModel())
	            .vehicleRegdate(vo.getVehicleRegdate())  
	            .vehicleType(vo.getVehicleType())
	            .vehicleSize(vo.getVehicleSize()) 
	            .build();

	    return dao.insertVehicle(newVehicle);
	}


	@Override
	public int updateVehicleImage(String vehicleCode, String vehicleImg) {
		return dao.updateVehicleImage(vehicleCode, vehicleImg);
	}

	@Override
	public int updateVehicleStatus(String vehicleCode, String vehicleStatus) {
		return dao.updateVehicleStatus(vehicleCode, vehicleStatus);
	}

	@Override
	public int deleteVehicle(String vehicleCode) {
		return dao.deleteVehicle(vehicleCode);
	}

	@Transactional
	@Override
	public int updateVRStatusIR(RepairVo vo) {
		RepairVo newRepair = RepairVo.builder()
				.vehicleCode(vo.getVehicleCode())
				.repairDetail(vo.getRepairDetail())
				.repairDate(vo.getRepairDate())
				.repairReason(vo.getRepairReason())
				.repairStatus(vo.getRepairStatus()).build();
		int r = dao.insertRepair(newRepair);
		int v = dao.updateVehicleStatusR();
		if((r+v)>0) {
			return 1;
		}
		return 0;
	}

	@Transactional
	@Override
	public int updateVRStatusOI(String RepairCode) {
		int r = dao.updateRepairStatusO(RepairCode);
		int v = dao.updateVehicleStatusI(RepairCode);
		if((r+v)==2) {
			return 1;
		}
		return 0;
	}

}
