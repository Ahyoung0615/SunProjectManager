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
	
	public List<ChatRoomVo> chatingList(String empCode){
		return chatDao.findChatRoom2(empCode);
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
    
    public List<ChatRoomVo> chatParti(String chatroomCode){
    	return chatDao.chatParti(chatroomCode);
    }
    
    public String getLastChatMessage(String chatroomCode){
    	// chatRepository를 통해 채팅방의 마지막 메시지를 조회
        ChatVo chatVo = chatDao.getLastChatMessage(chatroomCode);
        if (chatVo != null) {
            return chatVo.getChatContent(); // 마지막 메시지의 내용을 반환
        } else {
            return "No messages found";
        }
    }
}
