package com.brs.sun.controller;

import java.util.Map;

import org.json.simple.JSONObject;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/summary")
public class SummaryController {

    @PostMapping
    public String getSummary(@RequestBody Map<String, Object> requestData) {
        String url = "https://naveropenapi.apigw.ntruss.com/text-summary/v1/summarize";

        JSONObject requestBody = new JSONObject();
        
        // 클라이언트로부터 받은 데이터 추출
        Map<String, Object> document = (Map<String, Object>) requestData.get("document");
        Map<String, Object> option = (Map<String, Object>) requestData.get("option");
        
        // 받은 데이터 JSON 객체에 추가
        requestBody.put("document", document);
        requestBody.put("option", option);
        
        log.info("요약하는 항목 보이기{}", requestBody.toJSONString());

        try {
            Connection.Response response = Jsoup.connect(url)
                .header("X-NCP-APIGW-API-KEY-ID", "zfn5tq0pbg")
                .header("X-NCP-APIGW-API-KEY", "gUTjrYMRgTQiB5ZZgxZXea5qlb5mXg1JxRDRUeVP")
                .header("Content-Type", "application/json")
                .requestBody(requestBody.toJSONString())  // 전체 JSON 객체를 문자열로 변환
                .ignoreContentType(true)
                .method(Connection.Method.POST)
                .execute();
            
            return response.body();  // 서버 응답을 반환하거나 원하는 형태로 처리
        } catch (Exception e) {
            e.printStackTrace();
            return "요약 생성 중 오류가 발생했습니다.";  // 에러 처리
        }
    }

}