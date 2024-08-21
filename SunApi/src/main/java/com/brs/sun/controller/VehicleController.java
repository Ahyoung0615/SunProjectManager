package com.brs.sun.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
	public List<VehicleVo> getAllVehicle(
			@RequestParam(defaultValue = "1") int page,
		    @RequestParam(defaultValue = "10") int countList,
		    @RequestParam(required = false) String vehicleType
			){
		log.info("선택된 vehicleType : {}", vehicleType);
		return service.getAllVehicle(page, countList, vehicleType);
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
	public ResponseEntity<Integer> insertVehicle(
	    @RequestPart("vehicle") VehicleVo vo, 
	    @RequestPart("file") MultipartFile file) {
	    try {
	        log.info("입력된 VehicleVo : {}", vo);
	        log.info("입력된 file : {}", file);
	        int result = service.insertVehicle(vo, file);
	        return ResponseEntity.ok(result);
	    } catch (Exception e) {
	        log.error("Error while inserting vehicle", e);
	        return ResponseEntity.status(500).body(0);
	    }
	}


	@PostMapping("/vehicleImg")
	public ResponseEntity<Integer> updateVehicleImage(@RequestParam("vehicleCode") String vehicleCode, @RequestParam("file") MultipartFile file) {
	    try {
	        int result = service.updateVehicleImage(vehicleCode, file);
	        return ResponseEntity.ok(result);
	    } catch (Exception e) {
	        log.error("Error while updating vehicle image", e);
	        return ResponseEntity.status(500).body(0);
	    }
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
