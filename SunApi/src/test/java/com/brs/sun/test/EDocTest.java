package com.brs.sun.test;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.brs.sun.model.service.JsTreeService;
import com.brs.sun.vo.DepartmentVo;
import com.brs.sun.vo.EmployeeVo;

@SpringBootTest
class EDocTest {

	@Autowired
	private JsTreeService jsTreeService;
	
	@Autowired
	private SqlSessionTemplate template;
	
	@Test
	void jsTreetest() {
//		List<DepartmentVo> deptList = jsTreeService.getDept();
//		List<EmployeeVo> empList = jsTreeService.getEmp();
//		
//		assertNotEquals(0, deptList);
//		assertNotEquals(0, empList);
		
		List<EmployeeVo> empList = template.selectList("com.brs.sun.model.dao.JsTreeDao.choiceEmployee");
		assertNotNull(empList);
	}
	

}
