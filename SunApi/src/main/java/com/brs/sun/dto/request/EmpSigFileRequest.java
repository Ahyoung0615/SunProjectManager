package com.brs.sun.dto.request;

import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class EmpSigFileRequest {

	@Schema(description = "사원 이미지")
	private MultipartFile empSig;
	@Schema(description = "사원 코드")
	private int empCode;
	
}
