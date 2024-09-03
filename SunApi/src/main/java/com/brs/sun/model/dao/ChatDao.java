package com.brs.sun.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.brs.sun.vo.ChatRoomVo;
import com.brs.sun.vo.ChatVo;

@Mapper
public interface ChatDao {

	void createChatRoom(@Param("empCodes") String empCodes);
	
	boolean findRoom(@Param("empCodes") String empCodes);
	
	List<ChatRoomVo> findChatRoom(@Param("empCode") String empCode);
	
	List<ChatRoomVo> findChatRoom2(@Param("empCode") String empCode);
	
	List<ChatRoomVo> findChatParti(@Param("chatroomCode") String chatroomCode);

	void insertChatMessage(ChatVo message);
	
	List<ChatVo> chatList(@Param("chatroomCode") String chatroomCode);
	
	List<ChatRoomVo> chatParti(@Param("chatroomCode") String chatroomCode);
	
	ChatVo getLastChatMessage(@Param("chatroomCode") String chatroomCode);
	
}
