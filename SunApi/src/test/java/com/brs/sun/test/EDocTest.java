package com.brs.sun.test;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.brs.sun.model.dao.DayOffDao;
import com.brs.sun.model.dao.DayOffDaoImpl;
import com.brs.sun.model.service.DayOffService;
import com.brs.sun.model.service.JsTreeService;
import com.brs.sun.vo.DayOffVo;
import com.brs.sun.vo.DepartmentVo;
import com.brs.sun.vo.EmployeeVo;
import com.google.gson.JsonObject;

@SpringBootTest
class EDocTest {

	@Autowired
	private JsTreeService jsTreeService;
	
	@Autowired
	private DayOffService dayOffService;
	
	@Autowired
	private SqlSessionTemplate template;
	
	@Autowired
	private DayOffDao dao;
	
//	@Test
	void jsTreetest() {
//		List<DepartmentVo> deptList = jsTreeService.getDept();
//		List<EmployeeVo> empList = jsTreeService.getEmp();
//		
//		assertNotEquals(0, deptList);
//		assertNotEquals(0, empList);
		
		List<EmployeeVo> empList = template.selectList("com.brs.sun.model.dao.JsTreeDao.choiceEmployee");
		assertNotNull(empList);
	}
	
//	@Test
	void jsonTest() {
		JsonObject json = new JsonObject();
		
		json.addProperty("name", "test");
		json.addProperty("test", "test");
		
		System.out.println(json.toString().getClass().getName());
		System.out.println(json.getClass().getName());
	}
	
	@Test
	void chkDayOff() {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("dayOff", 2);
		map.put("empCode", 20030101);
		
		// dao select 테스트
//		DayOffVo selChk = dao.selectDayOff(20030101);
//		System.out.println(selChk);
//		assertNotNull(selChk);
		
		// dao update 테스트
//		boolean updateChk = dao.updateDayOff(map);
//		System.out.println(updateChk);
//		assertTrue(updateChk);
		
		boolean chk = dayOffService.dayOffTransaction(20030101, map);
		assertTrue(chk);
	}
}
