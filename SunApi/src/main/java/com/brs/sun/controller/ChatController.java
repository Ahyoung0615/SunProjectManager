package com.brs.sun.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.model.dao.ChatDao;
import com.brs.sun.model.dao.EmployeeDao;
import com.brs.sun.model.service.ChatService;
import com.brs.sun.model.service.EmployeeService;
import com.brs.sun.vo.ChatRoomVo;
import com.brs.sun.vo.ChatVo;
import com.brs.sun.vo.EmployeeVo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class ChatController {

	private final ChatService chatService;
	private final EmployeeDao employeeDao;
	private final EmployeeService employeeService;
    @PostMapping("/api/chat")
    public ResponseEntity<String> createChatRoom(@RequestBody List<String> empCodes) {
        // 배열을 쉼표로 구분된 문자열로 변환
        String empCodesStr = String.join(",", empCodes);
        chatService.createChatRoom(empCodesStr);
        return ResponseEntity.ok("Chat room created successfully");
    }
	
    @GetMapping("/api/chatList")
    public List<ChatRoomVo> getChatList(@RequestParam("empCode") String empCode) {
        EmployeeVo emp = employeeDao.Info(empCode);
        //log.info("Employee info: {}", emp);
        String empCodeString = String.valueOf(emp.getEmpCode());
        //log.info("Employee code: {}", empCodeString);
        return chatService.chatList(empCodeString);
    }
    @GetMapping("/api/employee/{empCode}")
    public ResponseEntity<EmployeeVo> getEmployeeInfo(@PathVariable("empCode") String empCode) {
        EmployeeVo employee = employeeService.getOneMember(empCode);
        if (employee == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(employee);
    }
    @MessageMapping("/chat.sendMessage/{chatroomCode}")
    @SendTo("/topic/chatRoom/{chatroomCode}")
    public ChatVo sendMessage(@DestinationVariable String chatroomCode, ChatVo message) {
        // Save the message to the database
        chatService.saveChatMessage(message);
        return message; // Return message to be broadcasted to other clients
    }
    @GetMapping("/chatList")
    public ResponseEntity<List<ChatVo>> getChatList1(@RequestParam("chatroomCode") String chatroomCode) {
        log.info("Received request to get chat list for chatroomCode: {}", chatroomCode);
        List<ChatVo> chatMessages = chatService.chatList2(chatroomCode);
        log.info("Returning chat messages: {}", chatMessages);
        return ResponseEntity.ok(chatMessages);
    }
    
    
}
