package com.brs.sun.test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.brs.sun.dto.response.AppEDocListResponseDTO;
import com.brs.sun.jpa.repository.EDocRepository;
import com.brs.sun.model.dao.DayOffDao;
import com.brs.sun.model.dao.EDocDao;
import com.brs.sun.model.service.DayOffService;
import com.brs.sun.model.service.EDocService;
import com.brs.sun.model.service.JsTreeService;
import com.brs.sun.vo.EDocLineVo;
import com.brs.sun.vo.EDocVo;
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
	
	@Autowired
	private EDocService docService;
	
	@Autowired
	private EDocDao eDocDao;
	
	@Autowired
	private EDocRepository docRepository;
	
	// 결재자 수 확인 테스트
//	@Test
	void appCountTest() {
//		int total = template.selectOne("com.brs.sun.model.dao.EDocDao.appTotalCount", 102);
//		int rem = template.selectOne("com.brs.sun.model.dao.EDocDao.appRemCount", 102);
//		int my = total - rem;
		
//		System.out.println("total " + total + "\n rem " + rem + "\n total - rem " + my);
//		assertNotNull(total);
		
//		int test = docService.chkApp(102);
//		System.out.println("test : " + test);
	}
	
	
	// nativeQuery Test
//	@Test
//	void repository() {
//		List<Object[]> results =  docRepository.findAllEDocWithEmployee();
//		List<AppEDocListResponseDTO>  dtos = results.stream()
//        .map(result -> new AppEDocListResponseDTO(
//            ((Number) result[0]).longValue(),   // eDocCode
//            (String) result[1],                // eDocTitle
//            ((Timestamp) result[2]).toLocalDateTime().toLocalDate(),             // eDocDate
//            (String) result[3]                 // empName
//        ))
//        .collect(Collectors.toList());
//		System.out.println(dtos);
//	}
	
	// jsTree 결재선 테스트
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
	
	//	jsonObject 변환 테스트
//	@Test
	void jsonTest() {
		JsonObject json = new JsonObject();
		
		json.addProperty("name", "test");
		json.addProperty("test", "test");
		
		System.out.println(json.toString().getClass().getName());
		System.out.println(json.getClass().getName());
	}
	
	// 남은 연차 조회 및 업데이트
//	@Test
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
		
	}
	
	// 결재자 테스트
//	@Test
	void selectEmp() {
		List<EDocVo> vo = docService.selectAppEmp(20081001);
		System.out.println("test Vo: " + vo.toString() + "\n vo size: " + vo.size());
		assertNotNull(vo);
	}
	
	// 문서 작성 테스트
//	@Test
	void chkInsertDoc() {
		String date = String.valueOf("2024-08-21");
		LocalDate updateDate = LocalDate.parse(date);
		
		EDocVo vo = EDocVo.builder()
                .edocType("V")
                .edocTitle("Jtest")
                .edocContent("test")
                .empCode(20030101)
                .edocDate(updateDate)
                .build();
		List<Integer> appList = new ArrayList<Integer>();
		appList.add(20010101);
		appList.add(20050101);
		appList.add(20120201);
		
		List<EDocLineVo> edocLine = new ArrayList<EDocLineVo>();
		for (Integer app : appList) {
			EDocLineVo ev = new EDocLineVo();
			ev.setEmpCode(app);
			edocLine.add(ev);
		}
		docService.insertTransaction(vo, edocLine);
		System.out.println("voTest: " + vo);
	}
	
	// 문서 작성 테스트
//	@Test
//	void chkInsertDoc() {
//	    String date = "2024-08-21";
//	    LocalDate updateDate = LocalDate.parse(date);
//
//	    EDocVo vo = EDocVo.builder()
//	                      .edocType("V")
//	                      .edocTitle("Jtest")
//	                      .edocContent("test")
//	                      .empCode(20030101)
//	                      .edocDate(updateDate)
//	                      .build();
//
//	    // Ensure edocCode is set after insertEDoc
//	    eDocDao.insertEDoc(vo);
//	    System.out.println("insertEdocDao : " + vo);
//	    assertNotNull(vo.getEdocCode(), "EDOC_CODE should be set after insertEDoc");
//
//	    List<Integer> appList = Arrays.asList(20010101, 20050101, 20120201);
//	    List<EDocLineVo> edocLine = new ArrayList<>();
//
//	    for (Integer app : appList) {
//	        edocLine.add(new EDocLineVo(vo.getEdocCode(), app));  // Set the edocCode here
//	    }
//
//	    eDocDao.insertEDocLine(edocLine);
//	}

}
