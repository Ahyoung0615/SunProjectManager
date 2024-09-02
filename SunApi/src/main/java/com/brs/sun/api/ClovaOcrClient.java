package com.brs.sun.api;

import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;


public interface ClovaOcrClient {

	@PostMapping(value = "/document/receipt", consumes = "application/json")
	Map<String, Object> ocrRecognition(@RequestHeader("X-OCR-SECRET") String secretKey,
								       @RequestBody ClovaOcrRequest request);
}
