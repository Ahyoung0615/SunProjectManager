package com.brs.sun.jpa.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "DAYOFF")
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DayOffEntity {
	
	//사원코드, PK
	@Id
	@Column(name = "EMP_CODE")
	private Long empCode;

	//사용가능 연차
	@Column(name = "DAYOFF_LEFT")
	private Integer dayOffLeft;
	
	//사용한 연차
	@Column(name = "DAYOFF_USED")
	private Integer dayOffUsed;
}
