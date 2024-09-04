package com.brs.sun.model.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
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
	
	private final String memberImagePath = "src/main/resources/static/memberImage";

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

		String originalFileName = file.getOriginalFilename();
		String fileName = empCode + originalFileName.substring(originalFileName.lastIndexOf("."));
		
		File filePath = new File(memberImagePath);
		
		if(!filePath.exists()) {
			filePath.mkdirs();
		}
		
		FileOutputStream fileOutputStream = new FileOutputStream(new File(memberImagePath + "/" + fileName));
		fileOutputStream.write(file.getBytes());
		fileOutputStream.flush();
		fileOutputStream.close();
		
	    employeeDao.updateImage(empCode, fileName);
    }
	
	public String getMemberImage(String empCode) {
		EmployeeVo vo = employeeDao.getMemberImage(empCode);
		
		if(vo.getEmpImg() != null) {
			File empImage = new File(memberImagePath + "/" + vo.getEmpImg());
			try (FileInputStream fileInputStream = new FileInputStream(empImage)){
				byte[] empImageByte = new byte[(int) empImage.length()];
				fileInputStream.read(empImageByte);
				
				String base64Encoded = Base64.getEncoder().encodeToString(empImageByte);
				String empImageToBase64 = "data:image/" + (vo.getEmpImg().substring(vo.getEmpImg().lastIndexOf(".") + 1)) + ";base64," + base64Encoded;
				
				return empImageToBase64;
			}catch (Exception e) {
				e.printStackTrace();
				return null;
			}
		} 
		return null;
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
	public boolean changePassword(String empCode ,String CurrentPassword , String ChangePassword) {
		EmployeeVo vo = employeeDao.Info(empCode);
		
		if(!bCryptPasswordEncoder.matches(CurrentPassword, vo.getEmpPw())) {
			return false;
		}
		String encChangePassword = bCryptPasswordEncoder.encode(ChangePassword);
		
		int updateRows = employeeDao.updatePassword(empCode, encChangePassword);
		
		if(updateRows > 0 ) {
			log.info("비밀번호 변경 성공: {}", encChangePassword);
			return true;
		}else {
			return false;
		}
			
	}
}
