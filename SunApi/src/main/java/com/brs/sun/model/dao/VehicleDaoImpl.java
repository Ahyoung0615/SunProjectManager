package com.brs.sun.model.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import com.brs.sun.vo.RepairVo;
import com.brs.sun.vo.VehicleVo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VehicleDaoImpl implements VehicleDao {

	private final SqlSessionTemplate template;

	private final String NS = "com.brs.sun.model.dao.VehicleDao.";

	@Override
	public List<VehicleVo> getAllVehicle(int first, int last, String vehicleType) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("first", first);
		params.put("last", last);
		params.put("vehicleType", vehicleType);
		return template.selectList(NS + "getAllVehicle", params);
	}

	@Override
	public VehicleVo getOneVehicle(String vehicleCode) {
		return template.selectOne(NS + "getOneVehicle", vehicleCode);
	}

	@Override
	public List<RepairVo> getAllRepair(String vehicleCode) {
		return template.selectList(NS + "getAllRepair", vehicleCode);
	}

	@Override
	public int insertVehicle(VehicleVo vo) {
		return template.insert(NS + "insertVehicle", vo);
	}

	@Override
	public int updateVehicleImage(String vehicleCode, String vehicleImg) {
		Map<String, String> params = new HashMap<>();
		params.put("vehicleCode", vehicleCode);
		params.put("vehicleImg", vehicleImg);
		return template.update(NS + "updateVehicleImage", params);
	}

	@Override
	public int updateVehicleStatus(String vehicleCode, String vehicleStatus) {
		Map<String, String> params = new HashMap<>();
		params.put("vehicleCode", vehicleCode);
		params.put("vehicleStatus", vehicleStatus);
		return template.update(NS + "updateVehicleStatus", params);
	}

	@Override
	public int deleteVehicle(String vehicleCode) {
		return template.delete(NS + "deleteVehicle", vehicleCode);
	}

	@Override
	public int insertRepair(RepairVo vo) {
		return template.insert(NS + "insertRepair", vo);
	}

	@Override
	public int updateRepairStatusO(String RepairCode) {
		return template.update(NS + "updateRepairStatusO", RepairCode);
	}

	@Override
	public int updateVehicleStatusR() {
		return template.update(NS + "updateVehicleStatusR");
	}

	@Override
	public int updateVehicleStatusI(String RepairCode) {
		return template.update(NS + "updateVehicleStatusI", RepairCode);
	}

	@Override
	public int countVehicle(String vehicleType) {
		return template.selectOne(NS + "countVehicle",vehicleType);
	}

}
