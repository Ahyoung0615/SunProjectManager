package com.brs.sun.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Base64;

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
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

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

	//게시글 파일 저장소
	private String uploadDir = "src/main/resources/static/boardFile";
	//게시글 이미지 미리보기 저장소
	String uploadDir2 = "src/main/resources/static/memberImage";
	
	//게시글 입력
	@PostMapping("/insertBoard")
	public ResponseEntity<String> insertBoard(@RequestParam("notiTitle") String notiTitle,
			@RequestParam("notiContent") String notiContent, @RequestParam("empCode") String empCode,
			@RequestParam("notiStatus") String notiStatus,
			@RequestParam(value = "files", required = false) List<MultipartFile> files) {
		if (files == null) {
		    files = new ArrayList<>();
		}
		
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
	//파일 다운로드
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
	//게시글 리스트 불러오기
	@GetMapping("/boardList")
	public List<NoticeVo> boardList() {
		return service.boardList();
	}
	//게시글 파일 불러오기
	@GetMapping("/files/{notiCode}")
	public List<NoticeFileVo> getFile(@PathVariable String notiCode) {
		int notiCodeStr = Integer.parseInt(notiCode);
		return service.getFile(notiCodeStr);
	}
	//게시글 수정
	@PostMapping("updateBoard/{notiCode}")
	public ResponseEntity<String> updateBoard(@PathVariable String notiCode,
			@RequestParam("notiTitle") String notiTitle, @RequestParam("notiContent") String notiContent,
			@RequestParam("notiStatus") String notiStatus,
			@RequestParam(value = "files", required = false) List<MultipartFile> files) throws IOException {
		
		if (files == null) {
		    files = new ArrayList<>();
		}
		
		// 파일 크기 검토
	    for (MultipartFile file : files) {
	        if (file.getSize() > 5 * 1024 * 1024) { // 5MB
	            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body("파일 크기가 너무 큽니다. 최대 크기는 5MB입니다.");
	        }
	    }
		
		int notiCodeStr = Integer.parseInt(notiCode);
		NoticeVo vo = new NoticeVo();
		vo.setNotiTitle(notiTitle);
		vo.setNotiContent(notiContent);
		vo.setNotiStatus(notiStatus);
		vo.setNotiCode(notiCodeStr);
		service.updateBoard(vo, files);
		return ResponseEntity.ok("게시글이 수정 되었습니다");
	}
	//게시글 삭제(소프트)
	@PostMapping("/deleteBoard/{notiCode}")
	public ResponseEntity<String> deleteBoard(@RequestParam String notiCode) {
		int notiCodeStr = Integer.parseInt(notiCode);
		NoticeVo vo = new NoticeVo();
		vo.setNotiCode(notiCodeStr);
		service.deleteBoard(vo);
		service.deleteFile(notiCodeStr);
		return ResponseEntity.ok("게시글이 삭제되었습니다");
	}
	//게시글 상세보기
	@GetMapping("/boardDetail/{notiCode}")
	public NoticeVo boardDetail(@PathVariable String notiCode) {
		return service.boardDetail(notiCode);
	}
	//게시글 이미지 업로드
	@PostMapping("/uploadImageBoard")
    public ResponseEntity<?> uploadImage(@RequestParam("upload") MultipartFile file) {
		try {
	        // 파일의 바이트 데이터를 Base64로 인코딩
	        String base64Image = Base64.getEncoder().encodeToString(file.getBytes());

	        // Base64 인코딩된 이미지 데이터를 CKEditor가 이해할 수 있는 응답으로 반환
	        String base64ImageUrl = "data:" + file.getContentType() + ";base64," + base64Image;

	        // CKEditor에 필요한 JSON 응답 반환
	        return ResponseEntity.ok().body(new ImageUploadResponse(true, base64ImageUrl));

	    } catch (IOException e) {
	        return ResponseEntity.status(500).body("파일 업로드 중 오류가 발생했습니다.");
	    }
    }

    // 이미지 업로드 응답 클래스
    public static class ImageUploadResponse {
        private boolean uploaded;
        private String url;

        public ImageUploadResponse(boolean uploaded, String url) {
            this.uploaded = uploaded;
            this.url = url;
        }

        public boolean isUploaded() {
            return uploaded;
        }

        public String getUrl() {
            return url;
        }
    }
	
	
	
}
