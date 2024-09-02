package com.brs.sun.api;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ClovaOcrService {

	private final ClovaOcrClient clovaOcrClient;
	
	@Value("${clova.documentOcr.secretkey}")
	private String secretKey;
	
	public Map<String, Object> recognizeText(MultipartFile image) throws IOException{
		ClovaOcrRequest clovaOcrRequest = new ClovaOcrRequest();
		clovaOcrRequest.setVersion("V2");
		clovaOcrRequest.setRequestId(UUID.randomUUID().toString());
		clovaOcrRequest.setTimestamp(System.currentTimeMillis());
		byte[] bytes = image.getBytes();
		String base64Encoded = Base64.getEncoder().encodeToString(bytes);
		clovaOcrRequest.setImages(Arrays.asList(new ClovaOcrRequest.Image(image.getContentType().substring(image.getContentType().lastIndexOf("/") + 1), base64Encoded, image.getOriginalFilename())));
		
		return clovaOcrClient.ocrRecognition(secretKey, clovaOcrRequest);
	}
}
