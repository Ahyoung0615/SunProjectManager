package com.brs.sun.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.model.service.VehicleService;
import com.brs.sun.vo.RepairVo;
import com.brs.sun.vo.VehicleVo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class VehicleController {
	
	private final VehicleService service;
	
	@GetMapping("/vehicle")
	public List<VehicleVo> getAllVehicle(@RequestParam(required = false) String vehicleType){
		log.info("선택된 vehicleType : {}", vehicleType);
		return service.getAllVehicle(vehicleType);
	}
	
	@GetMapping("/vehicle/{vehicleCode}")
	public VehicleVo getOneVehicle(@PathVariable String vehicleCode) {
	    log.info("선택된 vehicleCode : {}", vehicleCode);
	    return service.getOneVehicle(vehicleCode);
	}
	
	@GetMapping("/repair/{vehicleCode}")
	public List<RepairVo> getAllRepair(@PathVariable String vehicleCode) {
		log.info("선택된 repair vehicleCode : {}", vehicleCode);
		return service.getAllRepair(vehicleCode);
	}
	
	@PostMapping("/insertVehicle")
	public int insertVehicle(@RequestBody VehicleVo vo) {
	    log.info("입력된 VehicleVo : {}", vo);
	    return service.insertVehicle(vo);
	}
	
	@PostMapping("/vehicleDel/{vehicleCode}")
	public int deleteVehicle(@PathVariable  String vehicleCode) {
		log.info("삭제 선택된 vehicleCode : {}", vehicleCode);
		return service.deleteVehicle(vehicleCode);
	}
	
	@PostMapping("/insertRepair")
	public int insertRepair(@RequestBody RepairVo vo) {
		log.info("입력된 RepairVo : {}", vo);
		return service.updateVRStatusIR(vo);
	}
	
	@PostMapping("/updateRepair/{repairCode}")
	public int updateRepairStatusO(@PathVariable String repairCode) {
		log.info("입력된 repairCode : {}", repairCode);
		return service.updateVRStatusOI(repairCode);
	}
	
	
	

}
