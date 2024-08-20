package com.brs.sun.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.brs.sun.vo.ChatRoomVo;

@Mapper
public interface ChatDao {

	void createChatRoom(@Param("empCodes") String empCodes);
	
	List<ChatRoomVo> findChatRoom(@Param("empCode") String empCode);
}
