package com.brs.sun.model.service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.brs.sun.model.dao.ChatDao;
import com.brs.sun.vo.ChatRoomVo;

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
	
}
