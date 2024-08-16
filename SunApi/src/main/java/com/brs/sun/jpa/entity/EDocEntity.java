package com.brs.sun.jpa.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "EDOC")
@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EDocEntity {

	// 전자결재 JPA Entity
	
	// 문서 코드, PK
	@Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "eDoc_seq_gen")
    @SequenceGenerator(name = "eDoc_seq_gen", sequenceName = "eDoc_seq", allocationSize = 1)
    @Column(name = "EDOC_CODE")
    private Long eDocCode;

    // 문서 제목
    @Column(name = "EDOC_TITLE")
    private String eDocTitle;

    // 문서 내용
    @Column(name = "EDOC_CONTENT")
    private String eDocContent;

    // 기안자 사번
    @Column(name = "EMP_CODE")
    private Integer empCode;

    // 기안 날짜
    @Column(name = "EDOC_DATE")
    private LocalDate eDocDate;

    // 결재 상태 (결재 대기중 A, 결재 완료 S, 반려 R, 회수 C)
    @Column(name = "EDOC_STATUS")
    private String eDocStatus;
}
