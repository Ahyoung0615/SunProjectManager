package com.brs.sun.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.dto.request.MrReservationOverlapRequestDTO;
import com.brs.sun.dto.response.MrReservationDetailFullCalendarDTO;
import com.brs.sun.dto.response.MrReservationFullCalendarDTO;
import com.brs.sun.model.service.MrReservationService;
import com.brs.sun.vo.MeetRoomVo;
import com.brs.sun.vo.MrReservationVo;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "시설 예약 Controller", description = "시설 예약 CRUD Controller")
@Slf4j
@RestController
@RequestMapping("/api/mrReservation")
@RequiredArgsConstructor
public class MrReservationController {

	private final MrReservationService service;
	
	@Operation(summary = "예약 리스트", description = "전체 예약 리스트 반환")
	@ApiResponse(responseCode = "200", description = "예약 현황 전체 리스트 반환", content = @Content(schema = @Schema(implementation = MrReservationFullCalendarDTO.class)))
	@GetMapping("/getReservationList")
	public List<MrReservationFullCalendarDTO> selectMrReservation(){
		List<MrReservationFullCalendarDTO> fullCalendarList = new ArrayList<MrReservationFullCalendarDTO>();
		
		List<MrReservationVo> reservationList = service.selectReservationList();
		for (MrReservationVo mrReservationVo : reservationList) {
			fullCalendarList.add(new MrReservationFullCalendarDTO(mrReservationVo.getMrrCode() ,mrReservationVo.getMrrStarttime(), 
																  mrReservationVo.getMrrEndtime(), mrReservationVo.getMeetroomName()));
		}
		return fullCalendarList;
	}
	
	@Operation(summary = "예약 상세", description = "예약 내용 상세보기")
	@Parameter(name = "mrrCode", description = "시설 예약 코드")
	@ApiResponse(responseCode = "200", description = "예약 코드에 해당하는 예약 상세 내용 반환", content = @Content(schema = @Schema(implementation = MrReservationDetailFullCalendarDTO.class)))
	@GetMapping("/getReservationDetail")
	public MrReservationDetailFullCalendarDTO selectReservationDetail(@RequestParam int mrrCode) {
		MrReservationVo reservationDetail = service.selectReservationDetail(mrrCode);
		
		MrReservationDetailFullCalendarDTO fullCalendarDetail = MrReservationDetailFullCalendarDTO.builder()
																								  .mrrCode(reservationDetail.getMrrCode())
																								  .empCode(reservationDetail.getEmpCode())
																								  .empName(reservationDetail.getEmpName())
																								  .jobName(reservationDetail.getJobName())
																								  .deptName(reservationDetail.getDeptName())
																								  .start(reservationDetail.getMrrEndtime())
																								  .end(reservationDetail.getMrrEndtime())
																								  .title(reservationDetail.getMeetroomName())
																								  .build();
		return fullCalendarDetail;
	}
	
	@Operation(summary = "예약 중복 확인", description = "시설 예약시 중복 검사")
	@ApiResponse(responseCode = "200", description = "mrrStarttime, mrrEndtime 로 중복 검사 후 결과 반환 0 (중복 없음) / 1 (중복) ")
	@GetMapping("/getReservationOverlap")
	public int selectOverlap(@ModelAttribute MrReservationOverlapRequestDTO requestData) {
	    log.info("data: {}", requestData);
	    MrReservationVo vo = MrReservationVo.builder()
	                                        .mrrStarttime(requestData.getMrrStarttime())
	                                        .mrrEndtime(requestData.getMrrEndtime())
	                                        .meetroomCode(requestData.getMeetroomCode())
	                                        .build();
	    int overlap = service.selectOverlap(vo);
	    return overlap;
	}

	@Operation(summary = "회의실 정보", description = "회의실 정보 리스트 반환")
	@ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = MeetRoomVo.class)))
	@GetMapping("/getMeetRoom")
	public List<MeetRoomVo> selectMeetRoom(){
		List<MeetRoomVo> meetRoomList = service.selectMeetRoom();
		return meetRoomList;
	}

	@Operation(summary = "시설 예약", description = "중복 검사 후 중복 없는 예약 데이터베이스 저장")
	@ApiResponse(responseCode = "200", description = "예약 정보 데이터베이스 저장 성공")
	@PostMapping("/insertReservation")
	public ResponseEntity<String> insertReservation(@RequestBody MrReservationVo vo) {
		// 유효성 검사 로직 추가
		if (vo == null || vo.getMrrStarttime() == null || vo.getMrrEndtime() == null || vo.getMeetroomCode() == 0) {
			return ResponseEntity.badRequest().body("잘못된 데이터");
		}

		try {
			boolean chk = service.insertReservation(vo);
			if (chk) {
				return ResponseEntity.ok("success");
			} else {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("insert reservation 실패");
			}
		} catch (Exception e) {
			// 예외 처리 및 로깅
			log.error("Error while inserting reservation: {}", vo, e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("error 발생");
		}
	}
	
	@Operation(summary = "시설 예약 삭제", description = "해당 예약 코드 예약 삭제")
	@ApiResponse(responseCode = "200", description = "해당 예약 코드 예약 내용 데이터베이스 삭제 성공")
	@DeleteMapping("/deleteReservation/{mrrCode}")
    public ResponseEntity<String> deleteReservation(@PathVariable int mrrCode) {
        try {
            boolean isDeleted = service.deleteReservation(mrrCode);
            if (isDeleted) {
                return ResponseEntity.ok("Reservation deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                     .body("Reservation not found.");
            }
        } catch (Exception e) {
            // Log the exception
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("An error occurred while deleting the reservation.");
        }
    }
}
