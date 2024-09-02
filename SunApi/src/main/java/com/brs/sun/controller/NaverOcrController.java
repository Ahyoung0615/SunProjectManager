package com.brs.sun.controller;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.api.NaverOcrApi;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class NaverOcrController {

	private final NaverOcrApi naverOcrApi;
	
	@Value("${clova.ocr.secretkey}")
	private String secretKey;
	
	@GetMapping("/naverOCR")
	public ResponseEntity<List<String>> ocr() throws FileNotFoundException {
	    String fileName = "nong.png"; // 파일명
	    File file = ResourceUtils.getFile("classpath:static/image/" + fileName);

	    List<String> result = naverOcrApi.callOcrApi("POST", file.getPath(), secretKey, "png");

	    if (result != null && !result.isEmpty()) {
	        result.forEach(log::info);  // result에 있는 모든 문자열을 로그 출력
	    } else {
	        log.info("null or empty result");
	    }

	    return ResponseEntity.ok(result);
	}
	
	public ResponseEntity<String> fileUpload(){
		
		
		
		return ResponseEntity.ok("ok");
	}

}
