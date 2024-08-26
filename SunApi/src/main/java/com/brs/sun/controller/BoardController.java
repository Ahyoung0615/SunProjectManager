package com.brs.sun.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import com.brs.sun.model.dao.EmployeeDao;
import com.brs.sun.model.service.BoardService;
import com.brs.sun.model.service.ChatService;
import com.brs.sun.model.service.EmployeeService;
import com.brs.sun.vo.NoticeFileVo;
import com.brs.sun.vo.NoticeVo;

import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class BoardController {

	private final BoardService service;

	private String uploadDir = "C:\\SunPj_File\\boardFile";

	@PostMapping("/insertBoard")
	public ResponseEntity<String> insertBoard(@RequestParam("notiTitle") String notiTitle,
			@RequestParam("notiContent") String notiContent, @RequestParam("empCode") String empCode,
			@RequestParam("notiStatus") String notiStatus,
			@RequestParam(value = "files", required = false) List<MultipartFile> files) {

		
		// 파일 크기 검토
	    for (MultipartFile file : files) {
	        if (file.getSize() > 5 * 1024 * 1024) { // 5MB
	            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body("파일 크기가 너무 큽니다. 최대 크기는 5MB입니다.");
	        }
	    }
		
		int empCodeInt = Integer.parseInt(empCode);
		NoticeVo vo = new NoticeVo();
		vo.setNotiTitle(notiTitle);
		vo.setNotiContent(notiContent);
		vo.setEmpCode(empCodeInt);
		vo.setNotiStatus(notiStatus);
		
		try {
			service.insertBoard(vo, files);
			return ResponseEntity.ok("게시글 및 파일 업로드가 완료되었습니다.");
		} catch (IOException e) {
			log.error("파일 업로드 중 오류 발생", e);
			return ResponseEntity.status(500).body("파일 업로드 중 오류가 발생했습니다.");
		}
	}
	
	@GetMapping("/files/download/{nfileFakename}")
	public ResponseEntity<PathResource> downloadFile(@PathVariable String nfileFakename) {
		try {
			// 파일 경로 설정
			Path filePath = Paths.get(uploadDir).resolve(nfileFakename).normalize();
			PathResource resource = new PathResource(filePath);
			log.info("File path: " + filePath.toString());
			if (resource.exists()) {
				// 파일의 MIME 타입을 감지
				String contentType = Files.probeContentType(filePath);
				if (contentType == null) {
					contentType = "application/octet-stream"; // 기본 MIME 타입 설정
				}

				return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
						.header(HttpHeaders.CONTENT_DISPOSITION,
								"attachment; filename=\"" + resource.getFilename() + "\"")
						.body(resource);
			} else {
				return ResponseEntity.notFound().build();
			}
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@GetMapping("/boardList")
	public List<NoticeVo> boardList() {
		return service.boardList();
	}

	@GetMapping("/files/{notiCode}")
	public List<NoticeFileVo> getFile(@PathVariable String notiCode) {
		int notiCodeStr = Integer.parseInt(notiCode);
		return service.getFile(notiCodeStr);
	}

	@PostMapping("updateBoard/{notiCode}")
	public ResponseEntity<String> updateBoard(@PathVariable String notiCode,
			@RequestParam("notiTitle") String notiTitle, @RequestParam("notiContent") String notiContent,
			@RequestParam("notiStatus") String notiStatus) {

		int notiCodeStr = Integer.parseInt(notiCode);
		NoticeVo vo = new NoticeVo();
		vo.setNotiTitle(notiTitle);
		vo.setNotiContent(notiContent);
		vo.setNotiStatus(notiStatus);
		vo.setNotiCode(notiCodeStr);
		service.updateBoard(vo);
		return ResponseEntity.ok("게시글이 수정 되었습니다");
	}

	@PostMapping("/deleteBoard/{notiCode}")
	public ResponseEntity<String> deleteBoard(@RequestParam String notiCode) {
		int notiCodeStr = Integer.parseInt(notiCode);
		NoticeVo vo = new NoticeVo();
		vo.setNotiCode(notiCodeStr);
		service.deleteBoard(vo);
		return ResponseEntity.ok("게시글이 삭제되었습니다");
	}

	@GetMapping("/boardDetail/{notiCode}")
	public NoticeVo boardDetail(@PathVariable String notiCode) {
		return service.boardDetail(notiCode);
	}
}
