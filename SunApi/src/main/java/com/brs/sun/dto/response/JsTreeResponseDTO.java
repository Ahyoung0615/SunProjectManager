package com.brs.sun.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

public class JsTreeResponseDTO {
	
	@Schema(description = "Node Id")
	private final int id;
	
	@Schema(description = "Node Text")
	private final String text;
	
	@Schema(description = "Node ParentId")
	private final String parent;
	
	@Schema(description = "Node Icon")
	private final String icon;
	
	public JsTreeResponseDTO(int id, String text, String parent, String icon) {
		this.id = id;
		this.text = text;
		this.parent = parent;
		this.icon = icon;
	}

	public int getId() {
		return id;
	}

	public String getText() {
		return text;
	}

	public String getParent() {
		return parent;
	}

	public String getIcon() {
		return icon;
	}
	
}
