package com.brs.sun.model.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.brs.sun.dto.response.EDocDetailResponseDTO;
import com.brs.sun.dto.response.EDocLineResponseDTO;
import com.brs.sun.dto.response.TempEDocDetailResponseDTO;
import com.brs.sun.model.dao.EDocDao;
import com.brs.sun.vo.EDocFileVo;
import com.brs.sun.vo.EDocLineVo;
import com.brs.sun.vo.EDocVo;
import com.brs.sun.vo.EmployeeVo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EDocServiceImpl implements EDocService {

	private final EDocDao dao;
	
	private final String empSigPath = "src/main/resources/static/empSigImage";
	private final String eodcFilePath = "src/main/resources/static/edocFile";
	
	@Override
	public List<EDocVo> selectAppEmp(int empCode) {
		return dao.selectAppEmp(empCode);
	}
	
	@Override
	public List<EDocVo> selectMyAppSuccessList(int empCode) {
		return dao.selectMyAppSuccessList(empCode);
	}

	@Override
	public List<EDocVo> selectMyAppRejectList(int empCode) {
		return dao.selectMyAppRejectList(empCode);
	}
	
	@Override
	@Transactional
	public boolean insertTransaction(EDocVo vo, List<EDocLineVo> edocLineList) {
		boolean docInsertChk = dao.insertEDoc(vo);
		for(EDocLineVo inVo : edocLineList) {
			inVo.setEdocCode(vo.getEdocCode());
		}
		if(docInsertChk) {
			boolean docLineInsertChk = dao.insertEDocLine(edocLineList);
			return docLineInsertChk;
		} else {
			return false;
		}
	}
	
	@Override
	public boolean updateMyAppStatus(EDocVo vo) {
		return dao.updateMyAppStatus(vo);
	}
	
	@Override
	@Transactional
    public boolean updateEDoc(EDocVo vo, List<EDocLineVo> edocLineList) {
        // 문서를 업데이트
        if (!dao.updateEDoc(vo)) {
            return false;
        }

        // 각 edocLine에 edocCode를 설정
        edocLineList.forEach(eDocLineVo -> eDocLineVo.setEdocCode(vo.getEdocCode()));

        // 기존 결재 라인을 삭제. 실패 시 false 반환
        if (!dao.deleteAppList(vo)) {
            return false;
        }

        // 새로운 결재 라인을 삽입하고 결과를 반환.
        return dao.insertEDocLine(edocLineList);
    }
	
	@Override
	public TempEDocDetailResponseDTO selectTempDocDetail(int edocCode) {
		return TempEDocDetailResponseDTO.of(dao.selectTempDocDetail(edocCode));
	}
	
	@Override
	public EDocDetailResponseDTO selectDocDetail(int edocCode) {
		return EDocDetailResponseDTO.of(dao.selectDocDetail(edocCode));
	}
	
	@Override
	public List<EDocLineResponseDTO> selectEDocLine(int edocCode) {
		return dao.selectEDocLine(edocCode);
	}
	
	@Override
	public boolean appSuccess(Map<String, Object> map) {
		return dao.appSuccess(map);
	}
	
	@Override
	public boolean appRejecct(EDocVo vo) {
		return dao.appRejecct(vo);
	}
	
	@Override
	public boolean updateSuccessDocStatus(int edocCode) {
		return dao.updateSuccessDocStatus(edocCode);
	}
	
	@Override
	public boolean updateCancelDocStatus(int edocCode) {
		return dao.updateCancelDocStatus(edocCode);
	}
	
	@Override
	@Transactional
	public boolean updateRejectDocStatus(EDocVo vo) {
	    // 모든 DAO 메서드의 결과가 true일 때만 true를 반환
	    return dao.appRejecct(vo) 
	            && dao.updateDocReply(vo) 
	            && dao.updateRejectDocStatus(vo);
	}

	
	@Override
	public int chkApp(int edocCode) {
		int totalApp = dao.appTotalCount(edocCode);
		int remApp = dao.appRemCount(edocCode);
		return totalApp - remApp;
	}
	
	@Override
	public Map<Integer, String> selectEmployeeSignatures(List<Integer> empCodes) {
        Map<Integer, String> map = new HashMap<>();
        List<EmployeeVo> empList = dao.selectEmployeeSignatures(empCodes);
        System.out.println("empList "+empList);

        for (EmployeeVo employeeVo : empList) {
            if (employeeVo.getEmpSig() != null) {
                File empSigFile = new File(empSigPath + "/" + employeeVo.getEmpSig());
                try (FileInputStream fileInputStream = new FileInputStream(empSigFile)) {
                    byte[] empSigBytes = new byte[(int) empSigFile.length()];
                    fileInputStream.read(empSigBytes);

                    String base64Encoded = Base64.getEncoder().encodeToString(empSigBytes);
                    
                    String empSigBase64 = "data:image/" + (employeeVo.getEmpSig().substring(employeeVo.getEmpSig().lastIndexOf(".") + 1)) +";base64," + base64Encoded;
                    map.put(employeeVo.getEmpCode(), empSigBase64);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            } else {
                map.put(employeeVo.getEmpCode(), employeeVo.getEmpSig());
            }
        }
        System.out.println("map "+map);
        return map;
	}
	
	@Override
	public boolean updateEmpSig(int empCode, MultipartFile empSig) {
		try {
			if(!empSig.getContentType().startsWith("image/")) {
				return false;
			}
			
			String originalFileName = empSig.getOriginalFilename();
			String fileName = empCode + originalFileName.substring(originalFileName.lastIndexOf("."));
			
			File filePath = new File(empSigPath);
			
			if(!filePath.exists()) {
				filePath.mkdirs();
			}
			
			FileOutputStream outputStream = new FileOutputStream(new File(empSigPath + "/" + fileName));
			outputStream.write(empSig.getBytes());
			outputStream.flush();
			outputStream.close();
		
			return dao.updateEmpSig(empCode, fileName);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	@Override
	public boolean insertEDocFile(int edocCode, MultipartFile efileName) {
		try {
			if(!efileName.getContentType().startsWith("image/")) {
				return false;
			}
			
			String originalFileName = efileName.getOriginalFilename();
			String fileName = edocCode + originalFileName.substring(originalFileName.lastIndexOf("."));
			
			File filePath = new File(eodcFilePath);
			
			if(!filePath.exists()) {
				filePath.mkdirs();
			}
			
			FileOutputStream outputStream = new FileOutputStream(new File(eodcFilePath + "/" + fileName));
			outputStream.write(efileName.getBytes());
			outputStream.flush();
			outputStream.close();
			
			return dao.insertEDocFile(edocCode, fileName);
		}catch (Exception e) {
			e.printStackTrace();
			return false;
		} 
	}
	
}
