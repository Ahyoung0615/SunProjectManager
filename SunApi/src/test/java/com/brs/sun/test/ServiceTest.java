package com.brs.sun.test;

import static org.junit.jupiter.api.Assertions.assertNotEquals;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.brs.sun.model.service.JsTreeService;
import com.brs.sun.vo.DepartmentVo;
import com.brs.sun.vo.EmployeeVo;

@SpringBootTest
class ServiceTest {

	@Autowired
	private JsTreeService jsTreeService;
	
	@Test
	void test() {
		List<DepartmentVo> deptList = jsTreeService.getDept();
		List<EmployeeVo> empList = jsTreeService.getEmp();
		
		assertNotEquals(0, deptList);
		assertNotEquals(0, empList);
	}

}
