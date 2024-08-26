package com.brs.sun.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.brs.sun.vo.NoticeFileVo;
import com.brs.sun.vo.NoticeVo;

@Mapper
public interface BoardDao {
	
	void insertBoard(NoticeVo noticeVo);
	
	List<NoticeVo> boardList();
	
	List<NoticeFileVo> getFile(int notiCode);
	
	NoticeVo boardDetail(String notiCode);
	
	int updateBoard(NoticeVo noticeVo);
	
	int deleteBoard(NoticeVo noticeVo);
	
	int getLastNoticeCode();
	
	NoticeFileVo getFileByFakename(String nfileFakename);
	
	void insertNoticeFile(NoticeFileVo noticeFileVo);
	
	void deleteFile(String nfileCode);
}
