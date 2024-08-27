package com.brs.sun.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.dto.response.MrReservationDetailFullCalendarDTO;
import com.brs.sun.dto.response.MrReservationFullCalendarDTO;
import com.brs.sun.model.service.MrReservationService;
import com.brs.sun.vo.MrReservationVo;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/mrReservation")
@RequiredArgsConstructor
public class MrReservationController {

	private final MrReservationService mrReservationService;
	
	@GetMapping("/getReservationList")
	public List<MrReservationFullCalendarDTO> selectMrReservation(){
		List<MrReservationFullCalendarDTO> fullCalendarList = new ArrayList<MrReservationFullCalendarDTO>();
		
		List<MrReservationVo> reservationList = mrReservationService.selectReservationList();
		for (MrReservationVo mrReservationVo : reservationList) {
			fullCalendarList.add(new MrReservationFullCalendarDTO(mrReservationVo.getMrrCode() ,mrReservationVo.getMrrStartTime(), 
																  mrReservationVo.getMrrEndTime(), mrReservationVo.getMeetroomName()));
		}
		return fullCalendarList;
	}
	
	@GetMapping("/getReservationDetail")
	public MrReservationDetailFullCalendarDTO selectReservationDetail(@RequestParam int mrrCode) {
		MrReservationVo reservationDetail = mrReservationService.selectReservationDetail(mrrCode);
		
//		List<MrReservationDetailFullCalendarDTO> fullCalendarDetail = new ArrayList<MrReservationDetailFullCalendarDTO>();
//		fullCalendarDetail.add(new MrReservationDetailFullCalendarDTO(reservationDetail.getEmpName(), reservationDetail.getJobName(), 
//																	  reservationDetail.getDeptName(), reservationDetail.getMrrStartTime(), 
//																	  reservationDetail.getMrrEndTime(), reservationDetail.getMeetroomName()));
		MrReservationDetailFullCalendarDTO fullCalendarDetail = MrReservationDetailFullCalendarDTO.builder()
																								  .empCode(reservationDetail.getEmpCode())
																								  .empName(reservationDetail.getEmpName())
																								  .jobName(reservationDetail.getJobName())
																								  .deptName(reservationDetail.getDeptName())
																								  .start(reservationDetail.getMrrStartTime())
																								  .end(reservationDetail.getMrrEndTime())
																								  .title(reservationDetail.getMeetroomName())
																								  .build();
		return fullCalendarDetail;
	}
}
