package com.brs.sun;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.brs.sun.model.service.TestService;
import com.brs.sun.vo.JobVo;


@SpringBootTest
// @RequiredArgsConstructor // ApplicationContext 타지않기 때문에 생성자 주입 사용 불가
class SunApiApplicationTests {

	@Autowired
	private TestService test;
	
	@Test
	void contextLoads() {
		
//		int num = template.insert("TestMapper.testInsert");
//		assertEquals(1, num);
		
		List<JobVo> testList = test.testSelect();
		assertNotNull(testList);
	}

}
