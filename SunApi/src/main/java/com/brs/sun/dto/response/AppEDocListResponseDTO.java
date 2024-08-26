package com.brs.sun.dto.response;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class AppEDocListResponseDTO {
	
	private Long eDocCode;
	private String eDocTitle;
	private LocalDate eDocDate;
	private String empName;
	
	public static AppEDocListResponseDTO of(Long eDocCode, String eDocTitle, LocalDate eDocDate, String empName) {
        return new AppEDocListResponseDTO(eDocCode, eDocTitle, eDocDate, empName);
    }
	
}
