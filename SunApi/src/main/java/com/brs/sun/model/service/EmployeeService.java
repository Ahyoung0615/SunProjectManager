package com.brs.sun.model.service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.brs.sun.model.dao.EmployeeDao;
import com.brs.sun.vo.EmployeeVo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeService {

	private final EmployeeDao employeeDao;
	private final BCryptPasswordEncoder bCryptPasswordEncoder;

	public List<EmployeeVo> empList(){
		log.info("사원 리스트 조회");
		return employeeDao.MemberList();
	}
	public EmployeeVo getOneMember(String empCode) {
		 return employeeDao.Info(empCode);
	             
	}
	public List<EmployeeVo> empList1(){
		log.info("사원 리스트 조회");
		return employeeDao.MemberList1();
	}
	public List<EmployeeVo> empList2(){
		log.info("사원 리스트 조회");
		return employeeDao.MemberList2();
	}

	public void saveImage(MultipartFile file, String empCode) throws IOException {
        // 이미지 저장 디렉토리 설정
		String uploadDir = "C:\\Users\\GDJ\\git\\SunProjectManager\\SunApi\\src\\main\\webapp\\memberImage\\";

	    // 디렉토리가 존재하지 않으면 생성
	    File dir = new File(uploadDir);
	    if (!dir.exists()) {
	        dir.mkdirs();  // 디렉토리 및 하위 디렉토리 생성
	    }
	    // 파일명 설정
	    String fileName = empCode + "_" + file.getOriginalFilename();
	    File saveFile = new File(uploadDir + fileName);

	    // 파일 저장
	    file.transferTo(saveFile);

	    // DB에 파일명 업데이트
	    employeeDao.updateImage(empCode, fileName);
    }
	
	
	public int updateMember(EmployeeVo employeeVo) {
		int result = employeeDao.updateMember(employeeVo);
		return result > 0? 1 : 0;
	}
	
	public int passwordReset(String empCode) {
		 

	        // 비밀번호 업데이트 쿼리 실행
	        int result = employeeDao.passwordReset(empCode);
	        return result > 0 ? 1 : 0; // 성공 시 1, 실패 시 0 반환
	}
	public void registerEmployee(EmployeeVo employeeVo) {
		employeeDao.insertEmployee(employeeVo);
	}
	
}
