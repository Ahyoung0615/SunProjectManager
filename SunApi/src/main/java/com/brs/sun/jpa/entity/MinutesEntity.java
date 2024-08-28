package com.brs.sun.jpa.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Table(name = "MINUTES")
@Entity
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MinutesEntity {
	
	//회의록 코드, PK
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "minutes_seq_gen")
    @SequenceGenerator(name = "minutes_seq_gen", sequenceName = "minutes_seq", allocationSize = 1)
	@Column(name= "MINUTES_CODE")
	private Long minutesCode;
	
	//회의 일자
	@Column(name= "MINUTES_DATE")
	private LocalDate minutesDate;
	
	//회의실 장소
	@Column(name= "MEETROOM_CODE")
	private Integer meetroomCode;
	
	//회의록 작성자 사번
	@Column(name= "EMP_CODE")
	private Integer empCode;
	
	//회의 참여자 사번 {"사번":"이름"}
	@Column(name= "MINUTES_ATTENDEES")
	private String minutesAttendees;
	
	//회의 주제
	@Column(name= "MINUTES_SUBJECT")
	private String minutesSubject;
	
	//회의 내용 2000자
	@Lob
	@Column(name= "MINUTES_CONTENT")
	private String minutesContent;
	
	//회의록 요약
	@Lob
	@Column(name= "MINUTES_SUMMARY")
	private String minutesSummary;
	
}
