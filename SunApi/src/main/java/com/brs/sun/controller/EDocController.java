package com.brs.sun.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.dto.request.TempEDocUpdateRequestDTO;
import com.brs.sun.dto.request.VacationRequestDTO;
import com.brs.sun.dto.response.EDocDetailResponseDTO;
import com.brs.sun.dto.response.EDocLineResponseDTO;
import com.brs.sun.dto.response.TempEDocDetailResponseDTO;
import com.brs.sun.model.service.DayOffService;
import com.brs.sun.model.service.EDocService;
import com.brs.sun.vo.DayOffVo;
import com.brs.sun.vo.EDocLineVo;
import com.brs.sun.vo.EDocVo;
import com.google.gson.JsonObject;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/edoc")
@RequiredArgsConstructor
public class EDocController {

	private final DayOffService dayOffService;
	private final EDocService docService;
	
	// 결재 승인
	@PostMapping("/appSuccess")
	public String updateDocStatus(@RequestBody Map<String, Object> map) {
	    log.info("Received request with map: {}", map);

	    int edocCode;
	    try {
	        edocCode = Integer.parseInt(String.valueOf(map.get("edocCode")));
	    } catch (NumberFormatException e) {
	        log.error("Invalid edocCode: {}", map.get("edocCode"), e);
	        return "Invalid edocCode";
	    }

	    if (!docService.appSuccess(map)) {
	        log.warn("Document approval status update failed for edocCode: {}", edocCode);
	        return "상태 변경 오류";
	    }

	    int remainingApprovals = docService.chkApp(edocCode);
	    if (remainingApprovals == 0) {
	        if (docService.updateSuccessDocStatus(edocCode)) {
	            log.info("Document approval completed successfully for edocCode: {}", edocCode);
	            return "문서 결재완료 변경";
	        } else {
	            log.error("Failed to update document status to success for edocCode: {}", edocCode);
	            return "문서 변경 오류";
	        }
	    }

	    log.info("Document status updated, pending approvals remain for edocCode: {}", edocCode);
	    return "문서 상태 변경";
	}


	// 임시저장 상세
	@GetMapping("/tempDetail")
	public TempEDocDetailResponseDTO selectTempEDocDetail(@RequestParam int edocCode) {
		TempEDocDetailResponseDTO tempDetail = docService.selectTempDocDetail(edocCode);
		log.info("TempDetatil: {}", tempDetail.toString());
		return tempDetail;
	}
	
	// 문서 상세보기
	@GetMapping("/docDetail")
	public EDocDetailResponseDTO selectDocDetail(@RequestParam int edocCode) {
		EDocDetailResponseDTO docDetail = docService.selectDocDetail(edocCode);
		return docDetail;
	}

	// 저장된 결재선
	@GetMapping("/getEDocAppList")
	public List<EDocLineResponseDTO> selectEDocLine(@RequestParam int edocCode) {
		List<EDocLineResponseDTO> appList = docService.selectEDocLine(edocCode);
		return appList;
	}

	// 연차 확인
	@GetMapping("/getDayOff")
	public int getDayOffLeft(@RequestParam int empCode) {
		log.info("empCode 확인: {}", empCode);
		DayOffVo vo = dayOffService.selectDayOff(empCode);
		return vo.getDayoffLeft();
	}

	// 문서 작성
	@PostMapping("/insertVacation")
	public String insertVacation(@RequestBody VacationRequestDTO docData) {
		/*
		 * startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD 형식 endDate:
		 * endDate.toISOString().split('T')[0], // YYYY-MM-DD 형식 reason, weekdayCount,
		 * approvers: selectedApprovers.map(approver => approver.empCode) // 결재자 목록
		 */
		log.info("docData: {}", docData);

		String date = String.valueOf(docData.getUploadDate());
		LocalDate updateDate = LocalDate.parse(date);

		JsonObject jsonContent = new JsonObject();
		jsonContent.addProperty("startDate", docData.getStartDate());
		jsonContent.addProperty("endDate", docData.getEndDate());
		jsonContent.addProperty("usedDayOff", docData.getWeekdayCount());
		jsonContent.addProperty("reason", docData.getReason());
		log.info("jsonData: {}", jsonContent.toString());

		List<Integer> approvers = docData.getApprovers();
		log.info("appList: {}", approvers);

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("dayOff", docData.getWeekdayCount());
		map.put("empCode", docData.getEmpCode());

		boolean updateDayOff = dayOffService.updateDayOff(map);

		if (updateDayOff) {
			EDocVo vo = EDocVo.builder()
							  .edocType(docData.getDocType())
							  .edocTitle(docData.getDocTitle())
							  .edocContent(jsonContent.toString())
							  .empCode(docData.getEmpCode())
							  .edocDate(updateDate)
							  .edocStatus(docData.getDocStatus())
							  .build();
			
			List<EDocLineVo> edocLine = new ArrayList<EDocLineVo>();
			for (int i = 0; i < approvers.size(); i++) {
				EDocLineVo ev = new EDocLineVo();
				ev.setEmpCode(approvers.get(i));
				edocLine.add(ev);
			}
			docService.insertTransaction(vo, edocLine);
			docService.updateMyAppStatus(vo);
			return "ok";
		} else {
			return "fail";
		}
	}

	// 임시 문서 작성
	@PostMapping("/insertTempVacation")
	public String insertTempVacation(@RequestBody VacationRequestDTO docData) {
		/*
		 * startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD 형식 endDate:
		 * endDate.toISOString().split('T')[0], // YYYY-MM-DD 형식 reason, weekdayCount,
		 * approvers: selectedApprovers.map(approver => approver.empCode) // 결재자 목록
		 */
		log.info("docData: {}", docData);

		String date = String.valueOf(docData.getUploadDate());
		LocalDate updateDate = LocalDate.parse(date);

		JsonObject jsonContent = new JsonObject();
		jsonContent.addProperty("startDate", docData.getStartDate());
		jsonContent.addProperty("endDate", docData.getEndDate());
		jsonContent.addProperty("usedDayOff", docData.getWeekdayCount());
		jsonContent.addProperty("reason", docData.getReason());
		log.info("jsonData: {}", jsonContent.toString());

		List<Integer> approvers = docData.getApprovers();
		log.info("appList: {}", approvers);

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("dayOff", docData.getWeekdayCount());
		map.put("empCode", docData.getEmpCode());

		EDocVo vo = EDocVo.builder()
						  .edocType(docData.getDocType())
						  .edocTitle(docData.getDocTitle())
						  .edocContent(jsonContent.toString())
						  .empCode(docData.getEmpCode())
						  .edocDate(updateDate)
						  .edocStatus(docData.getDocStatus())
						  .build();

		log.info("docCode: {}", vo.getEdocCode());

		List<EDocLineVo> edocLine = new ArrayList<EDocLineVo>();
		for (int i = 0; i < approvers.size(); i++) {
			EDocLineVo ev = new EDocLineVo();
			ev.setEmpCode(approvers.get(i));
			edocLine.add(ev);
		}
		docService.insertTransaction(vo, edocLine);
		docService.updateMyAppStatus(vo);
		return "ok";
	}
	
	// 임시저장 문서 업데이트
	@PostMapping("/tempDocUpdate")
	public String updateTempEDoc(@RequestBody TempEDocUpdateRequestDTO docData) {
		log.info("tempData: {}", docData);
		
		String date = String.valueOf(docData.getUploadDate());
		LocalDate updateDate = LocalDate.parse(date);

		JsonObject jsonContent = new JsonObject();
		jsonContent.addProperty("startDate", docData.getStartDate());
		jsonContent.addProperty("endDate", docData.getEndDate());
		jsonContent.addProperty("usedDayOff", docData.getWeekdayCount());
		jsonContent.addProperty("reason", docData.getReason());
		log.info("jsonData: {}", jsonContent.toString());

		List<Integer> approvers = docData.getApprovers();
		log.info("appList: {}", approvers);

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("dayOff", docData.getWeekdayCount());
		map.put("empCode", docData.getEmpCode());
		
		boolean updateDayOff = dayOffService.updateDayOff(map);

		if (updateDayOff) {
			EDocVo vo = EDocVo.builder()
							  .edocCode(docData.getDocCode())
							  .edocTitle(docData.getDocTitle())
							  .edocContent(jsonContent.toString())
							  .empCode(docData.getEmpCode())
							  .edocDate(updateDate)
							  .edocStatus(docData.getDocStatus())
							  .build();
			
			List<EDocLineVo> edocLine = new ArrayList<EDocLineVo>();
			for (int i = 0; i < approvers.size(); i++) {
				EDocLineVo ev = new EDocLineVo();
				ev.setEmpCode(approvers.get(i));
				edocLine.add(ev);
			}
			docService.updateTempEDoc(vo, edocLine);
			docService.updateMyAppStatus(vo);
		}
		return "ok";
	}
}
