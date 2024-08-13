package com.brs.sun.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

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

	
	//로그인
	@GetMapping(value="/loginOk")
	public ResponseEntity<Map<String, String>> loginOk(){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		String empcode = authentication.getName();
		String authorities = authentication.getAuthorities().toString();
		
		log.info("로그인한 유저 아이디:" + empcode);
        log.info("유저 권한:" + authentication.getAuthorities());

        Map<String, String> login = createUserInfo(empcode, authorities);

		
        return ResponseEntity.ok(login);
	}
	//로그아웃
	@GetMapping("/logoutOk")
    public String logoutOk() {
        log.info("로그아웃 성공: {}");
        return "멍청아 성공하라고";
    }
	@PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setPath(request.getContextPath());
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok().build();
    }
	private Map<String, String> createUserInfo(String empcode, String authorities) {
        Map<String, String> userInfo = new HashMap<>();
        userInfo.put("empcode", empcode);
        userInfo.put("authorities", authorities);
        return userInfo;
    }
}
