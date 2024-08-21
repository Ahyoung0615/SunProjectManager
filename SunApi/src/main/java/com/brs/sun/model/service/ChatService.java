package com.brs.sun.model.service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.brs.sun.model.dao.ChatDao;
import com.brs.sun.vo.ChatRoomVo;
import com.brs.sun.vo.ChatVo;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ChatService {

	private final ChatDao chatDao;

	public List<ChatRoomVo> chatList(String empCode){
		return chatDao.findChatRoom(empCode);
	}
	
    public ChatService(ChatDao chatDao) {
        this.chatDao = chatDao;
    }

    public void createChatRoom(String empCodes) {
        chatDao.createChatRoom(empCodes);
    }
	
    public void saveChatMessage(ChatVo message) {
        chatDao.insertChatMessage(message);
    }
    
    public List<ChatVo> chatList2(String chatroomCode){
    	return chatDao.chatList(chatroomCode);
    }
}
