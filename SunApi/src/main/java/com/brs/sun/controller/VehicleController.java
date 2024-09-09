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
import com.brs.sun.vo.PagingVo;
import com.brs.sun.vo.RepairVo;
import com.brs.sun.vo.VehicleVo;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class VehicleController {

	private final VehicleService service;

	@Tag(name = "차량 controller", description = "차량관리 MyBatis CRUD Controller")
	@Operation(summary = "차량 정보 출력 조회", description = "차량 정보를 페이징 처리하여 조회")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "성공적으로 차량 정보를 가져옴.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = VehicleVo.class))),
			@ApiResponse(responseCode = "400", description = "잘못된 요청"),
			@ApiResponse(responseCode = "500", description = "서버 에러") })
	@GetMapping("/vehicle")
	public PagingVo<VehicleVo> getAllVehicle(@RequestParam(defaultValue = "1") int page,
			@RequestParam(defaultValue = "10") int countList, @RequestParam(required = false) String vehicleType) {
		log.info("선택된 vehicleType : {}", vehicleType);

		// 총 차량 수 조회
		int totalCount = service.countVehicle(vehicleType);

		// 페이징 객체 생성
		PagingVo<VehicleVo> paging = new PagingVo<>(page, countList, totalCount, 10);

		// 페이지 인덱스 계산
		int startRow = (page - 1) * countList + 1;
		int endRow = page * countList;

		// 데이터 조회
		List<VehicleVo> results = service.getAllVehicle(startRow, endRow, vehicleType);

		// 페이징 객체에 데이터 설정
		paging.setContent(results);

		return paging;
	}

	@Tag(name = "차량 controller", description = "차량관리 MyBatis CRUD Controller")
	@Operation(summary = "특정 차량 정보 조회", description = "차량 코드를 기반으로 차량 정보를 조회")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공적으로 차량 정보를 조회", content = @Content(mediaType = "application/json", schema = @Schema(implementation = VehicleVo.class))),
			@ApiResponse(responseCode = "404", description = "해당 차량 정보를 찾을 수 없음") })
	@GetMapping("/vehicle/{vehicleCode}")
	public VehicleVo getOneVehicle(@Parameter(description = "차량 코드") @PathVariable String vehicleCode) {
		log.info("선택된 vehicleCode : {}", vehicleCode);
		return service.getOneVehicle(vehicleCode);
	}

	@Tag(name = "차량 controller", description = "차량관리 MyBatis CRUD Controller")
	@Operation(summary = "차량 이미지 조회", description = "차량 코드를 통해 해당 차량의 이미지를 조회")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "성공적으로 차량 이미지를 조회"),
			@ApiResponse(responseCode = "404", description = "해당 차량 이미지를 찾을 수 없음") })
	@GetMapping("/vehicleImages/{vehicleCode}")
	public String selectVehicleImages(@Parameter(description = "차량 코드") @PathVariable String vehicleCode) {
		log.info("선택된 vehicleCode : {}", vehicleCode);
		return service.selectVehicleImages(vehicleCode);
	}

	@Tag(name = "차량 controller", description = "차량관리 MyBatis CRUD Controller")
	@Operation(summary = "차량 수리 내역 조회", description = "차량 코드로 해당 차량의 수리 내역을 조회")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "성공적으로 수리 내역을 조회=", content = @Content(mediaType = "application/json", schema = @Schema(implementation = RepairVo.class))),
			@ApiResponse(responseCode = "404", description = "해당 차량의 수리 내역을 찾을 수 없음") })
	@GetMapping("/repair/{vehicleCode}")
	public List<RepairVo> getAllRepair(@Parameter(description = "차량 코드") @PathVariable String vehicleCode) {
		log.info("선택된 repair vehicleCode : {}", vehicleCode);
		return service.getAllRepair(vehicleCode);
	}

	@Tag(name = "차량 controller", description = "차량관리 MyBatis CRUD Controller")
	@Operation(summary = "새 차량 추가", description = "새로운 차량과 이미지를 업로드하여 추가")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "차량이 성공적으로 추가됨"),
			@ApiResponse(responseCode = "500", description = "서버 에러로 차량 추가에 실패") })
	@PostMapping("/insertVehicle")
	public ResponseEntity<Integer> insertVehicle(@Parameter(description = "차량 정보") @RequestPart("vehicle") VehicleVo vo,
			@Parameter(description = "차량 이미지 파일") @RequestPart("file") MultipartFile file) {
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

	@Tag(name = "차량 controller", description = "차량관리 MyBatis CRUD Controller")
	@Operation(summary = "차량 이미지 업데이트", description = "특정 차량의 이미지를 업데이트")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "이미지가 성공적 업데이트"),
			@ApiResponse(responseCode = "500", description = "서버 에러로 이미지 업데이트에 실패") })
	@PostMapping("/vehicleImg")
	public ResponseEntity<Integer> updateVehicleImage(
			@Parameter(description = "차량 코드") @RequestParam("vehicleCode") String vehicleCode,
			@Parameter(description = "차량 이미지 파일") @RequestParam("file") MultipartFile file) {
		try {
			int result = service.updateVehicleImage(vehicleCode, file);
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			log.error("Error while updating vehicle image", e);
			return ResponseEntity.status(500).body(0);
		}
	}

	@Tag(name = "차량 controller", description = "차량관리 MyBatis CRUD Controller")
	@Operation(summary = "차량 삭제", description = "차량 코드를 통해 특정 차량을 삭제")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "차량이 성공적으로 삭제됨"),
			@ApiResponse(responseCode = "404", description = "해당 차량을 찾을 수 없음") })
	@PostMapping("/vehicleDel/{vehicleCode}")
	public int deleteVehicle(@Parameter(description = "차량 코드") @PathVariable String vehicleCode) {
		log.info("삭제 선택된 vehicleCode : {}", vehicleCode);
		return service.deleteVehicle(vehicleCode);
	}

	@Tag(name = "수리", description = "차량 수리 관련 API")
	@Operation(summary = "새로운 수리 내역 추가", description = "새로운 차량 수리 내역 추가")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "수리 내역이 성공적으로 추가됨"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청"),
        @ApiResponse(responseCode = "500", description = "서버 에러로 수리 내역 추가에 실패")
    })
    @PostMapping("/insertRepair")
    public int insertRepair(
        @Parameter(description = "추가할 수리 내역 정보", required = true) @RequestBody RepairVo vo) {
        log.info("입력된 RepairVo : {}", vo);
        return service.updateVRStatusIR(vo);
    }

	@Tag(name = "수리", description = "차량 수리 관련 API")
	@Operation(summary = "수리 상태 업데이트", description = "수리 상태 업데이트")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "수리 상태가 성공적으로 업데이트됨"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청"),
        @ApiResponse(responseCode = "404", description = "해당 수리 내역을 찾을 수 없음"),
        @ApiResponse(responseCode = "500", description = "서버 에러로 수리 상태 업데이트에 실패")
    })
    @PostMapping("/updateRepair/{repairCode}")
    public int updateRepairStatusO(
        @Parameter(description = "수리 코드", required = true) @PathVariable String repairCode) {
        log.info("입력된 repairCode : {}", repairCode);
        return service.updateVRStatusOI(repairCode);
    }

}
