package com.brs.sun.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor // final 필드 생성자
public class JsTreeResponseDTO {
	
	@Schema(description = "Node Id")
	private final int id;
	
	@Schema(description = "Node Text")
	private final String text;
	
	@Schema(description = "Node ParentId")
	private final String parent;
	
	@Schema(description = "Node Icon")
	private final String icon;
	
}
