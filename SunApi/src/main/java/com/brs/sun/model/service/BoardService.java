package com.brs.sun.model.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.brs.sun.model.dao.BoardDao;
import com.brs.sun.vo.NoticeVo;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BoardService {

	private final BoardDao dao;
	
	public BoardService(BoardDao dao) {
		this.dao = dao;
	}
	
	public void insertBoard(NoticeVo noticeVo) {
		dao.insertBoard(noticeVo);
	}
	
	public List<NoticeVo> boardList(){
		return dao.boardList();
	}
}
