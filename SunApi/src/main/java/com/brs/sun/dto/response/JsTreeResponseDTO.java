package com.brs.sun.dto.response;

public class JsTreeResponseDTO {
	
	private final int id;
	
	private final String text;
	
	private final String parent;
	
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
