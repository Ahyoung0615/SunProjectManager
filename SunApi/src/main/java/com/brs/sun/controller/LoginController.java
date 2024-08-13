package com.brs.sun.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brs.sun.model.service.EmployeeService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000/")
public class LoginController {

	private final EmployeeService employeeService;
	
	@GetMapping(value="/loginOk")
	public ResponseEntity<Map<String, String>> loginOk(){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
	        log.info("Authentication 객체가 null이거나 인증되지 않았습니다.");
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	    }
		String empcode = authentication.getName();
		String authorities = authentication.getAuthorities().toString();
		log.info("로그인한 유저 아이디:" + empcode);
        log.info("유저 권한:" + authentication.getAuthorities());

        Map<String, String> login = createUserInfo(empcode, authorities);

		
        return ResponseEntity.ok(login);
	}

	private Map<String, String> createUserInfo(String empcode, String authorities) {
        Map<String, String> userInfo = new HashMap<>();
        userInfo.put("empcode", empcode);
        userInfo.put("authorities", authorities);
        return userInfo;
    }
}
