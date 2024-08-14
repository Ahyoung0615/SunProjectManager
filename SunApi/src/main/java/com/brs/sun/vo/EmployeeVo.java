package com.brs.sun.vo;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeVo {

	// 사원

	// 사번, PK
	private int empCode;
	// 이름
	private String empName;
	// 비밀번호
	private String empPw;
	// 부서
	private int deptCode;
	// 직급
	private int jobCode;
	// 이메일
	private String empEmail;
	// 전화번호
	private String empTel;
	// 주소
	private String empAddress;
	// 성별
	private String gender;
	// 입사일
	private LocalDateTime joindate;
	// 재직 현황 (재직 Y, 퇴사 N)
	private String empStatus;
	// 사원 사진(경로)
	private String empImg;
	// 사용자 권한 (유저 U, 관리자 A)
	private String empAuth;

}
