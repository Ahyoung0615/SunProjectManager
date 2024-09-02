package com.brs.sun.api;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClovaOcrRequest {

	private String version;
	private String requestId;
	private Long timestamp;
	private List<Image> images;
	
	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	public static class Image {
		private String format;
		private String data;
		private String name;
	}
	
}
