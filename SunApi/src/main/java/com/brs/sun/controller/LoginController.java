package com.brs.sun.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.model.service.EmployeeService;
import com.brs.sun.vo.EmployeeVo;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000/")
public class LoginController {

	
	private final EmployeeService employeeService;
	private final SimpMessagingTemplate messagingTemplate; 
	//로그인
	@GetMapping(value="/loginOk")
	public ResponseEntity<Map<String, String>> loginOk(){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		String empcode = authentication.getName();
		String authorities = authentication.getAuthorities().toString();
		EmployeeVo vo = employeeService.getOneMember(empcode);
		String empName = vo.getEmpName();
		log.info("로그인한 유저 아이디:" + empcode);
        log.info("유저 권한:" + authentication.getAuthorities());

        Map<String, String> login = createUserInfo(empcode, authorities, empName);

        messagingTemplate.convertAndSend("/topic/login", login);
		
        return ResponseEntity.ok(login);
	}
	@MessageMapping("/login")
    @SendTo("/topic/login")
    public Map<String, String> handleLoginMessage(Map<String, String> message) {
        log.info("WebSocket 메시지 수신: {}", message);
        return message;
    }
	//로그아웃
	@GetMapping("/logoutOk")
    public String logoutOk() {
        log.info("로그아웃 성공");
        return "succes";
    }
	@PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        // 쿠키를 삭제하기 위한 명시적인 설정
        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        Cookie rememberMeCookie = new Cookie("remember-me-cookie", null);
        rememberMeCookie.setPath("/");
        rememberMeCookie.setMaxAge(0);
        response.addCookie(rememberMeCookie);
        log.info("로그아웃 완료 {}", cookie);
        return ResponseEntity.ok().build();
    }
	private Map<String, String> createUserInfo(String empcode, String authorities, String empName) {
        Map<String, String> userInfo = new HashMap<>();
        userInfo.put("empcode", empcode);
        userInfo.put("authorities", authorities);
        userInfo.put("empName", empName);
        return userInfo;
    }
	
	// 로그인 성공 후 자동 로그인 상태 확인
    @GetMapping("/checkRememberMe")
    public ResponseEntity<Map<String, String>> checkRememberMe(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        
        Map<String, String> response = new HashMap<>();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("remember-me-cookie".equals(cookie.getName())) {
                    // Remember-me 쿠키가 존재하는 경우
                    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                    if (authentication != null && authentication.isAuthenticated()) {
                        String empcode = authentication.getName();
                        EmployeeVo vo = employeeService.getOneMember(empcode);
                		String empName = vo.getEmpName();
                        response.put("empcode", empcode);
                        response.put("empName", empName); // 사용자 이름 등 추가 정보
                        response.put("authorities", authentication.getAuthorities().toString());
                        return ResponseEntity.ok(response);
                    }
                }
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
	
}
