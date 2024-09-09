package com.brs.sun.controller;

import java.util.Map;

import org.json.simple.JSONObject;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

@Tag(name="AI 요약 Controller", description = "CLOVA API 호출 요청")
@Slf4j
@RestController
@RequestMapping("/api/summary")
public class SummaryController {

	
	@Operation(summary = "텍스트 요약", description = "클라이언트에서 제공한 텍스트를 네이버 API를 통해 요약합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "요약 성공", content = @Content(mediaType = "application/json", schema = @Schema(implementation = String.class))),
        @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터"),
        @ApiResponse(responseCode = "500", description = "서버 에러")
    })
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
