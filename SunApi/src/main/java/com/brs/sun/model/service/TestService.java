package com.brs.sun.model.service;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Service;

import com.brs.sun.vo.JobVo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TestService {

	private final SqlSessionTemplate template;
	
	public String testMethod(String str) {
		return "ok";
	}
	
	public List<JobVo> testSelect(){
		return template.selectList("TestMapper.testSelect");
	}
}
