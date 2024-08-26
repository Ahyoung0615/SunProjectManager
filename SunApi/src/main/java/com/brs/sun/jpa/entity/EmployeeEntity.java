package com.brs.sun.jpa.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "EMPLOYEE") // 테이블 이름을 지정합니다
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동으로 생성된 값을 사용
    @Column(name = "EMP_CODE") 
    private Integer empCode;

    @Column(name = "EMP_NAME") 
    private String empName;

    @Column(name = "EMP_PW") 
    private String empPw;

    @Column(name = "DEPT_CODE") 
    private int deptCode;

    @Column(name = "JOB_CODE") 
    private int jobCode;

    @Column(name = "EMP_EMAIL") 
    private String empEmail;

    @Column(name = "EMP_TEL") 
    private String empTel;

    @Column(name = "EMP_ADDRESS") 
    private String empAddress;

    @Column(name = "GENDER") 
    private String gender;

    @Column(name = "JOINDATE") 
    private LocalDateTime joindate;

    @Column(name = "EMP_STATUS") 
    private String empStatus;

    @Column(name = "EMP_IMG") 
    private String empImg;

    @Column(name = "EMP_AUTH") 
    private String empAuth;
    
    @OneToMany(mappedBy = "employee")
    private List<EDocEntity> edocs;
}
