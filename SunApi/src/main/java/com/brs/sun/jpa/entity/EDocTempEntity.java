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
@Table(name = "EDTEMP") // 엔티티에 매핑될 테이블 이름
@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class EDocTempEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "eDocTemp_seq_gen")
    @SequenceGenerator(name = "eDocTemp_seq_gen", sequenceName = "eDoc_seq", allocationSize = 1)
    @Column(name = "EDTEMP_CODE") 
	// 임시저장 문서 코드
    private int edtempCode;

	// 제목
    @Column(name = "EDTEMP_TITLE")
    private String edtempTitle;

    // 상세
    @Column(name = "EDTEMP_CONTENT")
    private String edtempContent;

    // 기안자 사번
    @Column(name = "EMP_CODE")
    private Integer empCode;

    // 기안 일자
    @Column(name = "EDTEMP_DATE")
    private LocalDate edtempDate;
}
