package com.brs.sun.controller;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.dto.request.BTripRequestDTO;
import com.brs.sun.dto.response.VehicleRentDTO;
import com.brs.sun.model.service.BTripService;
import com.brs.sun.model.service.HolidayService;
import com.brs.sun.vo.BTripVo;
import com.brs.sun.vo.CoWorkVo;
import com.brs.sun.vo.PagingVo;
import com.brs.sun.vo.VehicleReservationVo;
import com.google.api.services.calendar.model.Event;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class BTripController {

    private final BTripService service;
    private final HolidayService holidayService;

    @Tag(name = "출장관리 Controller", description = "출장 관리 API")
    @Operation(summary = "출장 정보 조회", description = "특정 사원의 출장 목록을 조회합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공적으로 출장 목록을 가져옴"),
        @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @GetMapping("/btrip/{empCode}")
    public List<BTripVo> getMyBTrip(
        @Parameter(description = "사원 코드", example = "1001") @PathVariable String empCode) {
        log.info("getMyBTrip 요청 사원번호 : {}", empCode);
        return service.getMyBTrip(empCode);
    }

    @Tag(name = "공휴일관리 Controller", description = "공휴일 관리 API")
    @Operation(summary = "공휴일 조회", description = "구글 캘린더에서 공휴일을 조회합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공적으로 공휴일 정보를 가져옴"),
        @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @GetMapping("/holidays")
    public ResponseEntity<List<Event>> getHolidays() throws GeneralSecurityException, IOException {
        log.info("holidays 구글 공휴일 호출");
        List<Event> holidays = holidayService.getAllHolidaysFromRedisAsEvents();
        return new ResponseEntity<>(holidays, HttpStatus.OK);
    }

    @Tag(name = "공휴일관리 Controller", description = "공휴일 관리 API")
    @Operation(summary = "공휴일 추가", description = "새로운 공휴일을 추가합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "공휴일이 성공적으로 추가됨"),
        @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @PostMapping("/insertholiday")
    public void insertHoliday(@RequestBody Map<String, Object> holidayData) {
        String name = (String) holidayData.get("name");
        Map<String, String> startDateMap = (Map<String, String>) holidayData.get("startDate");
        Map<String, String> endDateMap = (Map<String, String>) holidayData.get("endDate");

        String startDate = startDateMap.get("date");
        String endDate = endDateMap.get("date");

        log.info("입력 공휴일 이름 : {}", name);
        log.info("입력 공휴일 시작 날짜 : {}", startDate);
        log.info("입력 공휴일 종료 날짜 : {}", endDate);

        holidayService.insertHoliday(name, startDate, endDate);
    }

    @Tag(name = "출장관리 Controller", description = "출장 관리 API")
    @Operation(summary = "출장 상세 조회", description = "특정 출장의 상세 정보를 조회합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공적으로 출장 상세 정보를 가져옴"),
        @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @GetMapping("/btripDetail/{btripCode}")
    public BTripVo getOneBTrip(
        @Parameter(description = "출장 코드", example = "1234") @PathVariable String bTripCode,
        @Parameter(description = "사원 코드") @RequestParam String empCode) {
        log.info("getOneBTrip 요청 empCode : {}", empCode);
        log.info("getOneBTrip 요청 bTripCode : {}", bTripCode);
        return service.getOneBTrip(bTripCode, empCode);
    }

    @Tag(name = "배차관리 Controller", description = "배차 관리 API")
    @Operation(summary = "배차 상세 조회", description = "특정 출장의 배차 예약 목록을 조회합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공적으로 배차 예약 정보를 가져옴"),
        @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @GetMapping("/vrsvDetail/{btripCode}")
    public List<VehicleReservationVo> getMyVehicleRsv(
        @Parameter(description = "출장 코드", example = "1234") @PathVariable String bTripCode,
        @Parameter(description = "사원 코드") @RequestParam String empCode) {
        log.info("getMyVehicleRsv 요청 empCode : {}", empCode);
        log.info("getMyVehicleRsv 요청 bTripCode : {}", bTripCode);
        return service.getMyVehicleRsv(bTripCode, empCode);
    }

    @Tag(name = "협력사관리 Controller", description = "협력사 관리 API")
    @Operation(summary = "협력사 목록 조회", description = "협력사의 목록을 페이징 처리하여 조회합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공적으로 협력사 목록을 가져옴"),
        @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @GetMapping("/cowork")
    public PagingVo<CoWorkVo> searchCoWork(
        @Parameter(description = "페이지 번호", example = "1") @RequestParam(defaultValue = "1") int page,
        @Parameter(description = "페이지당 항목 수", example = "5") @RequestParam(defaultValue = "5") int countList,
        @Parameter(description = "협력사 이름") @RequestParam(required = false) String cowName,
        @Parameter(description = "협력사 주소") @RequestParam(required = false) String cowAddress) {

        int totalCount = service.countCoWork(cowName, cowAddress);

        PagingVo<CoWorkVo> paging = new PagingVo<>(page, countList, totalCount, 10);
        List<CoWorkVo> results = service.searchCoWork((page - 1) * countList + 1, page * countList, cowName, cowAddress);
        paging.setContent(results);

        return paging;
    }

    @Tag(name = "협력사관리 Controller", description = "협력사 관리 API")
    @Operation(summary = "협력사 상세 조회", description = "특정 협력사의 상세 정보를 조회합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공적으로 협력사 정보를 가져옴"),
        @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @GetMapping("/coWorkDetail/{cowCode}")
    public CoWorkVo getOneCowork(
        @Parameter(description = "협력사 코드", example = "C001") @PathVariable String cowCode) {
        log.info("상세조회 협력사 코드 : {}", cowCode);
        return service.getOneCowork(cowCode);
    }

    @Tag(name = "협력사관리 Controller", description = "협력사 관리 API")
    @Operation(summary = "협력사 삭제", description = "협력사를 삭제합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공적으로 협력사가 삭제됨"),
        @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @PostMapping("/deleteCoWork")
    public int deleteCoWork(
        @Parameter(description = "협력사 코드") @RequestParam String cowCode) {
        log.info("삭제할 협력사 번호 : {}", cowCode);
        return service.deleteCoWork(cowCode);
    }

    @Tag(name = "협력사관리 Controller", description = "협력사 관리 API")
    @Operation(summary = "협력사 추가", description = "협력사를 추가합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공적으로 협력사가 추가됨"),
        @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @PostMapping("/insertCoWork")
    public int insertCoWork(
        @Parameter(description = "협력사 정보") @RequestBody CoWorkVo vo) {
        log.info("입력할 신규 협력사 정보 : {}", vo);
        return service.insertCoWork(vo);
    }

    @Tag(name = "협력사관리 Controller", description = "협력사 관리 API")
    @Operation(summary = "협력사 정보 수정", description = "협력사의 정보를 수정합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공적으로 협력사 정보가 수정됨"),
        @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @PostMapping("/updateCoWork")
    public int updateCoWork(
        @Parameter(description = "수정할 협력사 정보") @RequestBody CoWorkVo vo) {
        log.info("수정할 협력사 정보 : {}", vo);
        return service.updateCoWork(vo);
    }

    @Tag(name = "배차관리 Controller", description = "배차 관리 API")
    @Operation(summary = "모든 배차 예약 조회", description = "모든 배차 예약 목록을 페이징 처리하여 조회합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공적으로 배차 예약 목록을 가져옴"),
        @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @GetMapping("/getAllVehicleRsv")
    public PagingVo<VehicleRentDTO> getAllVehicleRsv(
        @Parameter(description = "페이지 번호", example = "1") @RequestParam(defaultValue = "1") int page,
        @Parameter(description = "페이지당 항목 수", example = "50") @RequestParam(defaultValue = "50") int countList,
        @Parameter(description = "시작 날짜") @RequestParam(required = false) String startDate,
        @Parameter(description = "종료 날짜") @RequestParam(required = false) String endDate) {

        log.info("startDate : {}", startDate);
        log.info("endDate : {}", endDate);

        if (startDate != null && startDate.trim().isEmpty()) {
            startDate = null;
        }
        if (endDate != null && endDate.trim().isEmpty()) {
            endDate = null;
        }

        int totalCount = service.countVehicleRsv(startDate, endDate);
        PagingVo<VehicleRentDTO> paging = new PagingVo<>(page, countList, totalCount, 10);
        List<VehicleRentDTO> results = service.getAllVehicleRsv((page - 1) * countList + 1, page * countList, startDate, endDate);
        paging.setContent(results);

        return paging;
    }

    @Tag(name = "배차관리 Controller", description = "배차 관리 API")
    @Operation(summary = "가용 차량 조회", description = "특정 날짜 범위 내에서 사용 가능한 차량을 조회합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공적으로 가용 차량을 가져옴"),
        @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @GetMapping("/availableVehicle")
    public List<Map<String, Object>> getAvailableVehicles(
        @Parameter(description = "시작 날짜") @RequestParam(required = false) String startDate,
        @Parameter(description = "종료 날짜") @RequestParam(required = false) String endDate) {
        log.info("startDate : {}", startDate);
        log.info("endDate : {}", endDate);
        return service.getAvailableVehicles(startDate, endDate);
    }

    @Tag(name = "출장관리 Controller", description = "출장 관리 API")
    @Operation(summary = "출장 및 배차 예약 추가", description = "새로운 출장 및 배차 예약을 추가합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공적으로 출장 및 배차 예약이 추가됨"),
        @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @PostMapping("/insertBTrip")
    public int insertBTripVRsv(
        @Parameter(description = "출장 및 배차 예약 정보") @RequestBody BTripRequestDTO requestDto) {
        log.info("requestDto:{}", requestDto);
        return service.insertBTripVRsv(requestDto);
    }

    @Tag(name = "배차관리 Controller", description = "배차 관리 API")
    @Operation(summary = "배차 예약 승인", description = "특정 배차 예약을 승인합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공적으로 배차 예약이 승인됨"),
        @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @PostMapping("/approveVRent")
    public int updateVehicleRsrvYes(
        @Parameter(description = "배차 예약 코드") @RequestParam String vrsvCode) {
        log.info("승인한 배차신청서 코드 : {}", vrsvCode);
        return service.updateVehicleRsrvYes(vrsvCode);
    }

    @Tag(name = "배차관리 Controller", description = "배차 관리 API")
    @Operation(summary = "배차 예약 반려", description = "특정 배차 예약을 반려합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공적으로 배차 예약이 반려됨"),
        @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @PostMapping("/rejectVRent")
    public int updateVehicleRsrvNo(
        @Parameter(description = "배차 예약 코드") @RequestParam String vrsvCode,
        @Parameter(description = "반려 사유") @RequestParam String vrsvReply) {
        log.info("반려한 배차신청서 코드 : {}", vrsvCode);
        log.info("반려한 배차신청서 반려사유 : {}", vrsvReply);
        return service.updateVehicleRsrvNo(vrsvCode, vrsvReply);
    }

    @Tag(name = "배차관리 Controller", description = "배차 관리 API")
    @Operation(summary = "배차 예약 상세 조회", description = "특정 배차 예약의 상세 정보를 조회합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공적으로 배차 예약 상세 정보를 가져옴"),
        @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @GetMapping("/vrentDetail/{vrsvCode}")
    public VehicleRentDTO getOneVehicleRsv(
        @Parameter(description = "배차 예약 코드") @PathVariable String vrsvCode) {
        log.info("getOneVehicleRsv 요청 vrsvCode : {}", vrsvCode);
        return service.getOneVehicleRsv(vrsvCode);
    }

    @Tag(name = "배차관리 Controller", description = "배차 관리 API")
    @Operation(summary = "배차 예약 수정", description = "기존 배차 예약을 수정합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "성공적으로 배차 예약이 수정됨"),
        @ApiResponse(responseCode = "500", description = "서버 에러")
    })
    @PostMapping("/reVehicleRsv")
    public void insertReVehicleRsc(
        @Parameter(description = "수정할 배차 예약 정보") @RequestBody Map<String, Object> requestDto) {
        log.info("재입력한 배차 신청서 정보 : {}", requestDto);
        VehicleRentDTO vehicleRentDTO = VehicleRentDTO.builder()
                .bTripCode(Integer.parseInt((String) requestDto.get("btripCode")))
                .vehicleCode(Integer.parseInt((String) requestDto.get("vehicleCode")))
                .vrsvDetail((String) requestDto.get("vrsvDetail"))
                .vrsvDate((String) requestDto.get("vrsvDate"))
                .build();

        service.insertReVehicleRsc(vehicleRentDTO);
    }
}
