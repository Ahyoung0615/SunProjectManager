package com.brs.sun.test;

import static org.junit.Assert.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.brs.sun.model.dao.ChatDao;
import com.brs.sun.model.service.ChatService;
import com.brs.sun.vo.ChatRoomVo;
import com.brs.sun.vo.ChatVo;

@SpringBootTest
public class ChatTest {

	@Autowired
	private ChatDao chatDao;
	
	@Autowired
	private ChatService chatService;
	
	//@Test
	void chatList() {
		List<ChatRoomVo> chatList = chatService.chatList("20010101");
		assertNotNull(chatList);
	}
	@Test
	void chatList2() {
		List<ChatVo> chatList = chatService.chatList2("17");
		assertNotNull(chatList);
	}
	
}
