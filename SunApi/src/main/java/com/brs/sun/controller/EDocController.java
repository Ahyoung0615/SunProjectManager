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
import com.brs.sun.vo.EDocLineVo;
import com.brs.sun.vo.EDocVo;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Tag(name = "전자결재 Controller", description = "전자결재 MyBatis CRUD Controller")
@Slf4j
@RestController
@RequestMapping("/api/edoc")
@RequiredArgsConstructor
public class EDocController {

	private final DayOffService dayOffService;
	private final EDocService docService;
	
	// @Operation: EndPoint 고유 식별자
	// summary: EndPoint 설며, Swagger-UI 상단에 노출
	// description: 상세 설명
	@Operation(summary = "결재 승인시 데이터베이스 상태 업데이트", description = "파라미터로 받은 해당 사원 결재 상태 업데이트")
	// Parameter: Parameter 이름
	@Parameters({
	    @Parameter(name = "edocCode", description = "승인된 문서 코드", required = true),
	    @Parameter(name = "empCode", description = "승인한 사원 코드", required = true)
	})
	// EndPoint 응답 정의. 응답 코드, 응답 타입, 설명 등을 명시
	// responseCode: HTTP 상태 코드
	// content: 페이로드(Payload) 구조. API 응답 데이터
	// schema: 응답 데이터의 형식, 정보
	@ApiResponse(responseCode = "200", description = "상태 업데이트 성공")
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
	
	@Operation(summary = "결재 반려시 데이터베이스 상태 업데이트", description = "파라미터로 받은 해당 사원 결재 상태 업데이트") 
	@ApiResponse(responseCode = "200", description = "상태 업데이트 성공 및 docEmpCode 해당하는 사원 연차 원복")
	@PostMapping("/appReject")
	public ResponseEntity<String> updateDocReply(@RequestBody EDocRejectRequestDTO dto) {
	    log.info("Received DTO: {}", dto);

	    JsonObject jsonObject = new JsonObject();
	    jsonObject.addProperty("empName", dto.getEmpName());
	    jsonObject.addProperty("jobName", dto.getJobName());
	    jsonObject.addProperty("deptName", dto.getDeptName());
	    jsonObject.addProperty("reason", dto.getReason());
	    jsonObject.addProperty("rejectDate", dto.getRejectDate());

	    log.info("Constructed JSON: {}", jsonObject);

	    EDocVo vo = EDocVo.builder()
	                      .edocCode(dto.getEdocCode())
	                      .empCode(dto.getEmpCode())
	                      .edocReply(jsonObject.toString())
	                      .build();

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

	@Operation(summary = "휴가 문서 회수", description = "기안 문서 회수 상태로 업데이트")
	@Parameters({
		@Parameter(name = "edocCode", description = "회수 문서 번호", required = true),
		@Parameter(name = "docEmpCode", description = "문서 기안자 사번", required = true),
		@Parameter(name = "weekdayCount", description = "사용한 연차 갯수", required = true)
	})
	@ApiResponse(responseCode = "200", description = "상태 업데이트 성공 및 docEmpCode 해당하는 사원 연차 원복")
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


	@Operation(summary = "문서 임시 저장", description = "기안 문서 임시저장")
	@Parameter(name = "edocCode", description = "임시저장 문서 번호", required = true)
	@ApiResponse(responseCode = "200", description = "문서 임시저장 상태 변환 성공", content = @Content(schema = @Schema(implementation = TempEDocDetailResponseDTO.class)))
	@GetMapping("/tempDetail")
	public TempEDocDetailResponseDTO selectTempEDocDetail(@RequestParam int edocCode) {
		TempEDocDetailResponseDTO tempDetail = docService.selectTempDocDetail(edocCode);
		log.info("TempDetatil: {}", tempDetail.toString());
		return tempDetail;
	}
	
	@Operation(summary = "문서 상세보기", description = "해당 문서 코드에 해당하는 상세보기")
	@Parameter(name = "edocCode", description = "상세 보기에 해당하는 문서 코드", required = true)
	@ApiResponse(responseCode = "200", description = "해당 문서 코드 상세 내용 반환", content = @Content(mediaType = "application/json", schema = @Schema(implementation = EDocDetailResponseDTO.class)))
	@GetMapping("/docDetail")
	public EDocDetailResponseDTO selectDocDetail(@RequestParam int edocCode) {
		EDocDetailResponseDTO docDetail = docService.selectDocDetail(edocCode);
		return docDetail;
	}

	@Operation(summary = "저장된 결재선 불러오기", description = "문서 코드에 맞는 저장되어 있는 결재선 불러오기")
	@Parameter(name = "edocCode", description = "결재선 불러와야 하는 문서 코드", required = true)
	@ApiResponse(responseCode = "200", description = "코드에 알맞는 저장된 결재선 반환")
	@GetMapping("/getEDocAppList")
	public List<EDocLineResponseDTO> selectEDocLine(@RequestParam int edocCode) {
		List<EDocLineResponseDTO> appList = docService.selectEDocLine(edocCode);
		return appList;
	}

	@Operation(summary = "남은 연차 갯수 가져오기", description = "휴가 신청서 작성시 잔여 연차 확인 후 사용 연차 갯수와의 유효성 검사")
	@Parameter(name = "empCode", description = "연차 불러와야 하는 사원 코드", required = true)
	@ApiResponse(responseCode = "200", description = "해당 사번의 잔여 연차 Return")
	@GetMapping("/getDayOff")
	public int getDayOffLeft(@RequestParam int empCode) {
		log.info("empCode 확인: {}", empCode);
		DayOffVo vo = dayOffService.selectDayOff(empCode);
		return vo.getDayoffLeft();
	}

	@Operation(summary = "휴가 신청서 데이터베이스 저장", description = "파라미터로 받은 문서 정보 데이터베이스 저장")
	@ApiResponse(responseCode = "200", description = "데이터베이스 저장 성공")
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
	
	@Operation(summary = "지출 결의서 데이터베이스 저장", description = "파라미터로 전달받은 문서 정보 데이터베이스 저장")
	@ApiResponse(responseCode = "200", description = "데이터베이스 저장 성공")
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
	
	@Operation(summary = "지출 결의서 영수증 파일 데이터베이스 저장", description = "업로드 영수증 파일 데이터베이스 저장")
	@Parameters({
	    @Parameter(name = "edocCode", description = "문서 코드", required = true),
	    @Parameter(name = "receipt", description = "영수증 파일", required = true)
	})
	@ApiResponse(responseCode = "200", description = "영수증 파일 데이터베이스 저장 성공")
	@PostMapping("/insertEDocFile")
	public ResponseEntity<String> insertEDocFile(@RequestParam int edocCode, @RequestParam MultipartFile receipt) throws IOException{
		log.info("code: {}, receipt: {}", edocCode, receipt);
		boolean isInserted = docService.insertEDocFile(edocCode, receipt);
		if (isInserted) {
		    return ResponseEntity.ok("영수증 파일 저장 성공");
		} else {
		    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("영수증 파일 저장 실패");
		}
	}

	@Operation(summary = "휴가 신청서 임시 저장", description = "휴가 신청 임시저장으로 연차 갯수 제외하지 않음")
	@ApiResponse(responseCode = "200", description = "휴가 신청서 데이터베이스 저장 성공", content = @Content(schema = @Schema(implementation = VacationRequestDTO.class)))
	@PostMapping("/insertTempVacation")
	public String insertTempVacation(@RequestBody VacationRequestDTO docData) {
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
	
	@Operation(summary = "임시 저장 문서 상태업데이트", description = "임시저장 문서 기안 상태로 업데이트")
	@ApiResponse(responseCode = "200", description = "임시저장(docStatus: T) 기안 (docStatus: A) 상태 업데이트 완료", content = @Content(schema = @Schema(implementation = TempEDocUpdateRequestDTO.class)))
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
	
	@Operation(summary = "사원 사인 이미지 업로드", description = "마이페이지에서 업로드된 사원 사인 이미지 Base64 인코딩")
	@Parameters({
		@Parameter(name = "empSig", description = "사원 업로드 이미지", required = true),
		@Parameter(name = "empCode", description = "업로드 사원 코드", required = true)
	})
	@ApiResponse(responseCode = "200", description = "업로드 이미지 Base64 인코딩 후 Return")
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
	
	@Operation(summary = "사원 이미지 불러오기", description = "상세보기, 마이페이지에서 사원 사인 이미지 불러오기")
	@Parameter(name = "empCodes", description = "사인 불러올 사원 코드들", required = true)
	@ApiResponse(responseCode = "200", description = "사원코드(Key):사인 이미지 Base64 인코딩(Value) Return")
	@GetMapping("/getEmpSignatures")
	public Map<Integer, String> getSignatures(@RequestParam List<Integer> empCodes) {
		Map<Integer, String> map = docService.selectEmployeeSignatures(empCodes);
		return map;
	}
	
	@Operation(summary = "영수증 이미지 불러오기", description = "상세보기 영수증 파일 불러오기")
	@Parameter(name = "edocCode", description = "영수증 이미지 불러올 문서 코드", required = true)
	@ApiResponse(responseCode = "200", description = "영수증 파일 Base64 인코딩 Return")
	@GetMapping("/getDocFile")
	public String selectDocFile(@RequestParam int edocCode) {
		return docService.selectDocFile(edocCode);
	}
}
