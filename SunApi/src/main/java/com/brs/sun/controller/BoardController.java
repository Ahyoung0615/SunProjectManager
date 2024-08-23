package com.brs.sun.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.model.dao.EmployeeDao;
import com.brs.sun.model.service.BoardService;
import com.brs.sun.model.service.ChatService;
import com.brs.sun.model.service.EmployeeService;
import com.brs.sun.vo.NoticeVo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class BoardController {

	private final BoardService service;
	
	@PostMapping("/insertBoard")
	public ResponseEntity<String> insertBoard(NoticeVo noticeVo){
		service.insertBoard(noticeVo);
		return ResponseEntity.ok("게시글 입력이 완료되었습니다");
	}
	
	@GetMapping("/boardList")
	public List<NoticeVo> boardList(){
		return service.boardList();
	}
	
}
