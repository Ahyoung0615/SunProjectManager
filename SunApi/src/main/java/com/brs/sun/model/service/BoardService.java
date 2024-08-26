package com.brs.sun.model.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.brs.sun.model.dao.BoardDao;
import com.brs.sun.vo.NoticeFileVo;
import com.brs.sun.vo.NoticeVo;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BoardService {

	private final BoardDao dao;
	
	
    private String uploadDir = "C:\\SunPj_File\\boardFile";
	
	public BoardService(BoardDao dao) {
		this.dao = dao;
	}
	
	
	@Transactional
    public void insertBoard(NoticeVo noticeVo, List<MultipartFile> files) throws IOException {
        // 게시글 저장
        dao.insertBoard(noticeVo);

        // 게시글 ID 가져오기
        Integer notiCode = dao.getLastNoticeCode(); // 가장 최근의 게시글 ID를 가져옵니다.

        // 파일 저장 및 데이터베이스에 파일 정보 저장
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    saveFile(file, notiCode);
                }
            }
        }
    }

	public void updateBoard(NoticeVo noticeVo, List<MultipartFile> files) throws IOException {
		//게시글 저장
		dao.updateBoard(noticeVo);
		
        
        dao.deleteFile(noticeVo.getNotiCode());
        
        // 새 파일 저장
        if (files != null && !files.isEmpty()) {
            Integer notiCode = noticeVo.getNotiCode();
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    saveFile(file, notiCode);
                }
            }
        }
	}
	
	public NoticeFileVo getFileByFakename(String nfileFakename) {
        return dao.getFileByFakename(nfileFakename); // 파일 정보를 데이터베이스에서 가져오는 메소드
    }
	
	public List<NoticeFileVo> getFile(int notiCode){
		return dao.getFile(notiCode);
	}
	
	public void insertBoard(NoticeVo noticeVo) {
		dao.insertBoard(noticeVo);
	}
	
	
	public List<NoticeVo> boardList(){
		return dao.boardList();
	}
	
	public NoticeVo boardDetail(String notiCode) {
		return dao.boardDetail(notiCode);
	}
	private void saveFile(MultipartFile file, Integer notiCode) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String fileName = System.currentTimeMillis() + "_" + originalFilename;
        Path path = Paths.get(uploadDir, fileName);

        Files.write(path, file.getBytes());

        NoticeFileVo noticeFileVo = new NoticeFileVo();
        noticeFileVo.setNotiCode(notiCode);
        noticeFileVo.setNfileOriginname(originalFilename);
        noticeFileVo.setNfileFakename(fileName);
        noticeFileVo.setNfilePath(path.toString());
        noticeFileVo.setNfileType(file.getContentType());
        noticeFileVo.setNotiSize(file.getSize());

        dao.insertNoticeFile(noticeFileVo);
        log.info("File uploaded successfully: " + fileName);
    }
	
	
	public int deleteBoard(NoticeVo noticeVo) {
		int result = dao.deleteBoard(noticeVo);
		return result > 0? 1:0;
	}
}
