package com.brs.sun.test;

import static org.junit.Assert.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.brs.sun.model.dao.BoardDao;
import com.brs.sun.model.service.BoardService;
import com.brs.sun.vo.NoticeVo;

@SpringBootTest
public class BoardTest {

	@Autowired
	private BoardDao boardDao;
	
	@Autowired
	private BoardService boardService;
	
	@Test
	void boardList() {
		List<NoticeVo> boardVo = boardService.boardList();
		assertNotNull(boardVo);
	}
	
}
