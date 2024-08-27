package com.brs.sun.test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.brs.sun.vo.MrReservationVo;

@SpringBootTest
public class MrReservationTest {

	@Autowired
	private SqlSessionTemplate template;
	
	@Test
	void fullCalendarListTest() {
		List<MrReservationVo> list = template.selectList("com.brs.sun.model.dao.MrReservationDao.selectReservationList");
		System.out.println(list);
		assertNotNull(list);
	}
}
