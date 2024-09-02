package com.brs.sun.api;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class ClovaOcrClientRestTemplate implements ClovaOcrClient {

	private final RestTemplate restTemplate;
	
	@Value("${clova.documentOcr.url}")
    private String OCR_URL;
	
	@Override
	public Map<String, Object> ocrRecognition(String secretKey, ClovaOcrRequest request) {
        // 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-OCR-SECRET", secretKey);
        headers.set("Content-Type", "application/json");

        // 요청 본문 설정
        HttpEntity<ClovaOcrRequest> requestEntity = new HttpEntity<>(request, headers);

        // POST 요청
        ResponseEntity<Map> response = restTemplate.exchange(
                OCR_URL,
                HttpMethod.POST,
                requestEntity,
                Map.class
        );

        // 상태 코드 확인
        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        } else {
            throw new RuntimeException("API 호출 실패: " + response.getStatusCode());
        }
	}

}
