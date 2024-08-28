package com.brs.sun.test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.brs.sun.vo.MrReservationVo;

@SpringBootTest
public class MrReservationTest {

	@Autowired
	private SqlSessionTemplate template;
	
//	@Test
	void fullCalendarListTest() {
		List<MrReservationVo> list = template.selectList("com.brs.sun.model.dao.MrReservationDao.selectReservationList");
		System.out.println(list);
		assertNotNull(list);
	}
	
	@Test
	void overlapTest() {
		Map<String, Object> map = new HashMap<String, Object>();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		String start = "2024-07-08 10:00:00";
		String end = "2024-08-05 10:00:00";
		
		LocalDateTime startDate = LocalDateTime.parse(start, formatter);
		LocalDateTime endDate = LocalDateTime.parse(end, formatter);
		
		map.put("mrrStarttime", startDate);
		map.put("mrrEndtime", endDate);
		map.put("meetroomCode", 101);
		int n = template.selectOne("com.brs.sun.model.dao.MrReservationDao.selectOverlap", map);
		System.out.println("~~ n: " + n);
	}
}
