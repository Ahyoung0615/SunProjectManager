package com.brs.sun.controller;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("")
@RequiredArgsConstructor
@Tag(name = "채팅 Controller", description = "채팅 관련 API를 제공합니다.")
public class ChatController {

	private final ChatService chatService;
	private final EmployeeDao employeeDao;
	private final EmployeeService employeeService;

	private final SimpMessagingTemplate messagingTemplate;

	// 채팅방 만들기
	@Operation(summary = "채팅방 생성", description = "입력된 사용자 코드에 기반하여 새로운 채팅방을 생성합니다.")
	@ApiResponse(responseCode = "200", description = "채팅방이 성공적으로 생성되었습니다.")
	@PostMapping("/api/chat")
	public ResponseEntity<String> createChatRoom(@Parameter(description = "참여할 직원들의 코드 목록") @RequestBody List<String> empCodes) {

		List<String> sortedEmpCodes = empCodes.stream().map(Integer::parseInt) // String -> Integer 변환
				.sorted() // 오름차순 정렬
				.map(String::valueOf) // Integer -> String 변환
				.collect(Collectors.toList());
		// 배열을 쉼표로 구분된 문자열로 변환
		String empCodesStr = String.join(",", sortedEmpCodes);

		// 중복 검사
		boolean roomExists = chatService.chatRoom(empCodesStr);
		if (roomExists) {
			// 채팅방이 이미 존재하는 경우
			log.info("채팅방존재");
			return ResponseEntity.status(HttpStatus.CONFLICT).body("채팅방이 존재합니다");
		}

		chatService.createChatRoom(empCodesStr);
		// 새 채팅방이 생성되었음을 알리는 메시지 전송
		messagingTemplate.convertAndSend("/topic/newChat", "새 채팅방이 생성되었습니다");

		return ResponseEntity.ok("채팅방 생성되었습니다");
	}

	// 채티방목록 불러오기
	@Operation(summary = "채팅방 목록 조회", description = "해당 직원의 채팅방 목록을 조회합니다.")
	@ApiResponse(responseCode = "200", description = "채팅방 목록이 성공적으로 조회되었습니다.")
	@GetMapping("/api/chatList")
	public List<ChatRoomVo> getChatList(@Parameter(description = "직원 코드") @RequestParam("empCode") String empCode) {
		EmployeeVo emp = employeeDao.Info(empCode);
		// log.info("Employee info: {}", emp);
		String empCodeString = String.valueOf(emp.getEmpCode());
		// log.info("Employee code: {}", empCodeString);
		return chatService.chatList(empCodeString);
	}

	// 채팅방 참여자 불러오기
	@Operation(summary = "채팅방 참여자 목록 조회", description = "지정된 채팅방의 참여자 목록을 조회합니다.")
	@ApiResponse(responseCode = "200", description = "참여자 목록이 성공적으로 조회되었습니다.")
	@GetMapping("/api/partiList")
	public List<ChatRoomVo> partiList(@Parameter(description = "채팅방 코드") @RequestParam("chatroomCode") String chatroomCode) {
		return chatService.partiList(chatroomCode);
	}

	// 채팅 내용 불러오기
	@Operation(summary = "채팅 메시지 목록 조회", description = "지정된 직원의 채팅 메시지 목록을 조회합니다.")
	@ApiResponse(responseCode = "200", description = "채팅 메시지 목록이 성공적으로 조회되었습니다.")
	@GetMapping("/api/chatList2")
	public List<ChatRoomVo> getChatList2(@Parameter(description = "직원 코드") @RequestParam("empCode") String empCode) {
		EmployeeVo emp = employeeDao.Info(empCode);
		// log.info("Employee info: {}", emp);
		String empCodeString = String.valueOf(emp.getEmpCode());
		// log.info("Employee code: {}", empCodeString);
		return chatService.chatingList(empCodeString);
	}

	// 직무, 부서정보 불러오기
	@GetMapping("/api/employee/{empCode}")
	public ResponseEntity<EmployeeVo> getEmployeeInfo(@PathVariable("empCode") String empCode) {
		EmployeeVo employee = employeeService.getOneMember(empCode);
		if (employee == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(employee);
	}

	// 메세지 받고 저장
	@Operation(summary = "채팅 메시지 전송", description = "지정된 채팅방으로 메시지를 전송합니다.")
	@ApiResponse(responseCode = "200", description = "채팅 메시지가 성공적으로 전송되었습니다.")
	@MessageMapping("/chat.sendMessage/{chatroomCode}")
	@SendTo("/topic/chatRoom/{chatroomCode}")
	public ChatVo sendMessage(@Parameter(description = "채팅방 코드") @DestinationVariable String chatroomCode, 
			@Parameter(description = "메시지 내용") ChatVo message) {
		log.info("메세지 보낸 채팅방 번호: {}", chatroomCode);
		chatService.saveChatMessage(message);
		return message;
	}

	@Operation(summary = "채팅방 메시지 조회", description = "지정된 채팅방의 메시지 목록을 조회합니다.")
	@ApiResponse(responseCode = "200", description = "메시지 목록이 성공적으로 조회되었습니다.")
	@GetMapping("/chatList")
	public ResponseEntity<List<ChatVo>> getChatList1(@Parameter(description = "채팅방 코드") @RequestParam("chatroomCode") String chatroomCode) {
		log.info("Received request to get chat list for chatroomCode: {}", chatroomCode);
		List<ChatVo> chatMessages = chatService.chatList2(chatroomCode);
		log.info("Returning chat messages: {}", chatMessages);
		return ResponseEntity.ok(chatMessages);
	}

	@Operation(summary = "채팅방 참여자 목록 조회", description = "지정된 채팅방의 참여자 목록을 조회합니다.")
	@ApiResponse(responseCode = "200", description = "참여자 목록이 성공적으로 조회되었습니다.")
	@GetMapping("/chatParti")
	public ResponseEntity<List<ChatRoomVo>> getChatParti(@Parameter(description = "채팅방 코드") @RequestParam("chatroomCode") String chatroomCode) {
		log.info("Received request to get chat list for chatroomCode: {}", chatroomCode);
		List<ChatRoomVo> chatParti = chatService.chatParti(chatroomCode);
		log.info("Returning chat messages: {}", chatParti);
		return ResponseEntity.ok(chatParti);
	}
	// 마지막메세지 불러오기(안씀)
//    @GetMapping("/getLastChatMessage")
//    public ResponseEntity<String> getLastChatMessage(@RequestParam("chatroomCode") String chatroomCode) {
//        try {
//            String lastChat = chatService.getLastChatMessage(chatroomCode);
//            log.info("마지막 메세지 {}", lastChat);
//            return ResponseEntity.ok(lastChat);
//        } catch (Exception e) {
//            log.error("Error getting last chat message", e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving last chat message");
//        }
//    }

}
