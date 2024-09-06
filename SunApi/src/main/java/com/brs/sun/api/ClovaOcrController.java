package com.brs.sun.api;

import java.io.IOException;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "영수증 스캔 Naver OCR 연동 Controller", description = "영수증 스캔(Document Version) Naver OCR 연동 Controller")
@RestController
@RequestMapping("/api/clova")
@RequiredArgsConstructor
public class ClovaOcrController {

	private final ClovaOcrService service;
	
	@Operation(summary = "영수증 내용 스캔", description = "영수증 내용 스캔 후 해당 내용에 맞게 분류 후 반환")
	@Parameter(name = "receipt", description = "업로드 영수증 파일")
	@ApiResponse(responseCode = "200", description = "각 세부 내역에 맞춰 대 > 중 > 소 분류로 반환")
	@PostMapping("/setReceipt")
	public Map<String, Object> docReceiptImage(@RequestParam MultipartFile receipt) throws IOException{
		return service.recognizeText(receipt);
	}

}
