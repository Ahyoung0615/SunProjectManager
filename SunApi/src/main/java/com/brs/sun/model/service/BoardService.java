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

        if (notiCode == null) {
            throw new RuntimeException("게시글 ID를 가져오는 데 실패했습니다.");
        }

        // 파일 저장 및 데이터베이스에 파일 정보 저장
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    try {
                        // 파일 저장
                        String originalFilename = file.getOriginalFilename();
                        String fileName = System.currentTimeMillis() + "_" + originalFilename;
                        Path path = Paths.get(uploadDir, fileName);

                        // 파일을 지정된 경로에 저장
                        Files.write(path, file.getBytes());

                        // 파일 정보 데이터베이스에 저장
                        NoticeFileVo noticeFileVo = new NoticeFileVo();
                        noticeFileVo.setNotiCode(notiCode);
                        noticeFileVo.setNfileOriginname(originalFilename);
                        noticeFileVo.setNfileFakename(fileName);
                        noticeFileVo.setNfilePath(path.toString());
                        noticeFileVo.setNfileType(file.getContentType());
                        noticeFileVo.setNotiSize(file.getSize());

                        dao.insertNoticeFile(noticeFileVo);
                        log.info("File uploaded successfully: " + fileName);
                    } catch (IOException e) {
                        log.error("Error saving file: " + file.getOriginalFilename(), e);
                        throw new IOException("Failed to save file: " + file.getOriginalFilename(), e);
                    }
                }
            }
        } else {
            log.info("No files selected for upload.");
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
	
	public void deleteFile(String notiCode) {
		dao.deleteFile(notiCode);
	}
	
	public List<NoticeVo> boardList(){
		return dao.boardList();
	}
	
	public NoticeVo boardDetail(String notiCode) {
		return dao.boardDetail(notiCode);
	}
	
	public int updateBoard(NoticeVo noticeVo) {
		int result = dao.updateBoard(noticeVo);
		return result > 0? 1:0;
	}
	
	public int deleteBoard(NoticeVo noticeVo) {
		int result = dao.deleteBoard(noticeVo);
		return result > 0? 1:0;
	}
}
