package com.brs.sun.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.brs.sun.dto.request.EDocRejectRequestDTO;
import com.brs.sun.dto.request.ExpenseDocRequest;
import com.brs.sun.dto.request.ExpenseSubResultRequest;
import com.brs.sun.dto.request.TempEDocUpdateRequestDTO;
import com.brs.sun.dto.request.VacationRequestDTO;
import com.brs.sun.dto.response.EDocDetailResponseDTO;
import com.brs.sun.dto.response.EDocLineResponseDTO;
import com.brs.sun.dto.response.TempEDocDetailResponseDTO;
import com.brs.sun.model.service.DayOffService;
import com.brs.sun.model.service.EDocService;
import com.brs.sun.vo.DayOffVo;
import com.brs.sun.vo.EDocFileVo;
import com.brs.sun.vo.EDocLineVo;
import com.brs.sun.vo.EDocVo;
import com.google.gson.JsonArray;
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
	public String updateSuccessDocStatus(@RequestBody Map<String, Object> map) {
	    int edocCode;
	    try {
	        edocCode = Integer.parseInt(String.valueOf(map.get("edocCode")));
	    } catch (NumberFormatException e) {
	    	e.printStackTrace();
	        return "Invalid edocCode";
	    }

	    if (!docService.appSuccess(map)) {
	        return "상태 변경 오류";
	    }

	    int remainingApprovals = docService.chkApp(edocCode);
	    if (remainingApprovals == 0) {
	        if (docService.updateSuccessDocStatus(edocCode)) {
	            return "문서 결재완료 변경";
	        } else {
	            return "문서 변경 오류";
	        }
	    }

	    return "문서 상태 변경";
	}
	
	// 문서 반려
	@PostMapping("/appReject")
	public ResponseEntity<String> updateDocReply(@RequestBody EDocRejectRequestDTO dto) {
	    log.info("Received DTO: {}", dto);

	    // JSON 객체 생성 및 매핑
	    JsonObject jsonObject = new JsonObject();
	    jsonObject.addProperty("empName", dto.getEmpName());
	    jsonObject.addProperty("jobName", dto.getJobName());
	    jsonObject.addProperty("deptName", dto.getDeptName());
	    jsonObject.addProperty("reason", dto.getReason());
	    jsonObject.addProperty("rejectDate", dto.getRejectDate());

	    log.info("Constructed JSON: {}", jsonObject);

	    // EDocVo 객체 빌드
	    EDocVo vo = EDocVo.builder()
	                      .edocCode(dto.getEdocCode())
	                      .empCode(dto.getEmpCode())
	                      .edocReply(jsonObject.toString())
	                      .build();

	    // dayOffService revertDayOff 호출
	    Map<String, Object> map = Map.of(
	        "weekdayCount", dto.getWeekdayCount(),
	        "empCode", dto.getDocEmpCode()
	    );

	    if (dayOffService.revertDayOff(map)) {
	        boolean updateResult = docService.updateRejectDocStatus(vo);
	        return updateResult ? ResponseEntity.ok("success") : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Update failed");
	    } else {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Day off revert failed");
	    }
	}

	@PostMapping("/docCancel")
	public String updateCancelDocStatus(@RequestBody Map<String, Integer> map) {
	    log.info("request data: {}", map);

	    if (map == null || !map.containsKey("weekdayCount") || !map.containsKey("docEmpCode") || !map.containsKey("edocCode")) {
	        log.warn("Invalid input data: {}", map);
	        return "fail";
	    }

	    // revertMapData에 필요한 데이터 추가
	    Map<String, Object> revertMapData = new HashMap<>();
	    revertMapData.put("weekdayCount", map.get("weekdayCount"));
	    revertMapData.put("empCode", map.get("docEmpCode"));

	    try {
	        // 연차 복구
	        boolean revertDayOff = dayOffService.revertDayOff(revertMapData);

	        if (revertDayOff) {
	            // 문서 상태 업데이트
	            boolean updateStatus = docService.updateCancelDocStatus(map.get("edocCode"));
	            return updateStatus ? "success" : "fail";
	        } else {
	            log.warn("Failed to revert day off for empCode: {}", map.get("docEmpCode"));
	            return "fail";
	        }
	    } catch (Exception e) {
	        log.error("Exception occurred while processing docCancel for edocCode: {}", map.get("edocCode"), e);
	        return "fail";
	    }
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
		 * startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD 형식 
		 * endDate: endDate.toISOString().split('T')[0], // YYYY-MM-DD 형식 reason, weekdayCount,
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
		jsonContent.addProperty("weekdayCount", docData.getWeekdayCount());
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
	
	@PostMapping("/insertExpenseApp")
	public ResponseEntity<Integer> insertExpenseApp(@RequestBody ExpenseDocRequest request){
		log.info("list : {}", request);
		
		String date = String.valueOf(request.getUploadDate());
		LocalDate updateDate = LocalDate.parse(date);
		
		List<ExpenseSubResultRequest> list = request.getItems();
		JsonArray jsonArray = new JsonArray();
		for (ExpenseSubResultRequest subResultRequest : list) {
			JsonObject jsonItem = new JsonObject();
			jsonItem.addProperty("count", subResultRequest.getCount());
			jsonItem.addProperty("name", subResultRequest.getName());
			jsonItem.addProperty("price", subResultRequest.getPrice());
			jsonArray.add(jsonItem);
		}
		
		JsonObject jsonContent = new JsonObject();
		jsonContent.addProperty("startDate", request.getStartDate());
		jsonContent.addProperty("reason", request.getReason());
		jsonContent.addProperty("totalPrice", request.getTotalPrice());
		jsonContent.addProperty("storeInfo", request.getStoreInfo());
		jsonContent.add("items", jsonArray);
		log.info("jsonData: {}", jsonContent);
		
		EDocVo vo = EDocVo.builder()
						  .edocType(request.getDocType())
						  .edocTitle(request.getDocTitle())
						  .edocContent(jsonContent.toString())
						  .empCode(request.getEmpCode())
						  .edocDate(updateDate)
						  .edocStatus(request.getDocStatus())
						  .build();
		
		List<Integer> approvers = request.getApprovers();
		
		List<EDocLineVo> edocLine = new ArrayList<EDocLineVo>();
		for (int i = 0; i < approvers.size(); i++) {
			EDocLineVo ev = new EDocLineVo();
			ev.setEmpCode(approvers.get(i));
			edocLine.add(ev);
		}
		docService.insertTransaction(vo, edocLine);
		docService.updateMyAppStatus(vo);
		
		return ResponseEntity.ok(vo.getEdocCode());
	}
	
	@PostMapping("/insertEDocFile")
	public ResponseEntity<String> insertEDocFile(@RequestParam int edocCode, @RequestParam MultipartFile receipt) throws IOException{
		log.info("code: {}, receipt: {}", edocCode, receipt);
		
		/*
		 * boolean updateCheck = docService.updateEmpSig(empCode, empSig);
		
		if(updateCheck) {
			byte[] empSigBytes = empSig.getBytes();
			
			String base64Encoded = Base64.getEncoder().encodeToString(empSigBytes);
			return "data:" + empSig.getContentType() + ";base64," + base64Encoded;
		} else {
			return "fail";
		}
		 */
		
		boolean insertEDocFileChk = docService.insertEDocFile(edocCode, receipt);
		
		if (insertEDocFileChk) {
			return ResponseEntity.ok("잘 했어요");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("못했어요");
		}
	}

	// 임시 문서 작성
	@PostMapping("/insertTempVacation")
	public String insertTempVacation(@RequestBody VacationRequestDTO docData) {
		/*
		 * startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD 
		 * 형식 endDate: endDate.toISOString().split('T')[0], // YYYY-MM-DD 형식 reason, weekdayCount,
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
		jsonContent.addProperty("weekdayCount", docData.getWeekdayCount());
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
	@PostMapping("/docUpdate")
	public String updateTempEDoc(@RequestBody TempEDocUpdateRequestDTO docData) {
		log.info("tempData: {}", docData);
		
		String date = String.valueOf(docData.getUploadDate());
		LocalDate updateDate = LocalDate.parse(date);

		JsonObject jsonContent = new JsonObject();
		jsonContent.addProperty("startDate", docData.getStartDate());
		jsonContent.addProperty("endDate", docData.getEndDate());
		jsonContent.addProperty("usedDayOff", docData.getWeekdayCount());
		jsonContent.addProperty("reason", docData.getReason());
		jsonContent.addProperty("weekdayCount", docData.getWeekdayCount());
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
			docService.updateEDoc(vo, edocLine);
			docService.updateMyAppStatus(vo);
		}
		return "ok";
	}
	
	// 사인 이미지 파일 업로드
	@PostMapping("/empSigUpload")
	public String empSigFileUpload(@RequestParam MultipartFile empSig, 
            					   @RequestParam int empCode) throws IOException {
		boolean updateCheck = docService.updateEmpSig(empCode, empSig);
		
		if(updateCheck) {
			byte[] empSigBytes = empSig.getBytes();
			
			String base64Encoded = Base64.getEncoder().encodeToString(empSigBytes);
			return "data:" + empSig.getContentType() + ";base64," + base64Encoded;
		} else {
			return "fail";
		}
	}
	
	@GetMapping("/getEmpSignatures")
	public Map<Integer, String> getSignatures(@RequestParam List<Integer> empCodes) {
		Map<Integer, String> map = docService.selectEmployeeSignatures(empCodes);
		return map;
	}
	
	@GetMapping("/getDocFile")
	public String selectDocFile(@RequestParam int edocCode) {
		return docService.selectDocFile(edocCode);
	}
}
