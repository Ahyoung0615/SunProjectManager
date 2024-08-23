package com.brs.sun.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.brs.sun.vo.NoticeVo;

@Mapper
public interface BoardDao {
	
	void insertBoard(NoticeVo noticeVo);
	
	List<NoticeVo> boardList();
}
