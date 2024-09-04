package com.brs.sun.model.service;

import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.calendar.model.Events;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;

@Service
public class HolidayService {

    private static final String APPLICATION_NAME = "groupware";
    private static final String CREDENTIALS_FILE_PATH = "client_secret.json"; // 파일 이름만 지정

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    //@Scheduled(cron = "*/30 * * * * *") //30초 한번 테스트코드
    @Scheduled(cron = "0 0 0 * * ?")  // 매일 자정에 실행
    public void cacheHolidaysDaily() throws GeneralSecurityException, IOException {
        var httpTransport = GoogleNetHttpTransport.newTrustedTransport();
        var jsonFactory = GsonFactory.getDefaultInstance();

        // ClassLoader를 사용해 resources 폴더의 파일을 읽기
        ClassLoader classLoader = getClass().getClassLoader();
        try (InputStream credentialsStream = classLoader.getResourceAsStream(CREDENTIALS_FILE_PATH)) {
            if (credentialsStream == null) {
                throw new RuntimeException("Failed to load credentials file.");
            }

            // GoogleCredentials 객체 생성
            GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream)
                    .createScoped(Collections.singleton("https://www.googleapis.com/auth/calendar"));

            // HttpRequestInitializer 생성
            HttpCredentialsAdapter requestInitializer = new HttpCredentialsAdapter(credentials);

            // Calendar 서비스 객체 생성
            Calendar service = new Calendar.Builder(httpTransport, jsonFactory, requestInitializer)
                    .setApplicationName(APPLICATION_NAME).build();

            // Google Calendar API에서 공휴일 데이터 가져오기
            Events events = service.events().list("ko.south_korea#holiday@group.v.calendar.google.com")
                    .setTimeMin(new DateTime(new GregorianCalendar().get(java.util.Calendar.YEAR) + "-01-01T00:00:00Z"))
                    .setTimeMax(new DateTime(new GregorianCalendar().get(java.util.Calendar.YEAR) + "-12-31T00:00:00Z"))
                    .setOrderBy("startTime").setSingleEvents(true).execute();

            List<Event> holidays = events.getItems();
            System.out.println("====데이터 캐싱 시작====");

            // Redis에 공휴일 정보 저장
            for (Event holiday : holidays) {
                System.out.println("====공휴일 정보 저장====");
                String dateKey = "holiday:" + holiday.getStart().getDate().toString(); // 예: holiday:2024-01-01
                String holidayName = holiday.getSummary(); // 공휴일 이름

                redisTemplate.opsForValue().set(dateKey, holidayName);
            }

            System.out.println("====데이터 캐싱 완료====");
        }
    }
    
    
    //공휴일 입력 메서드
    public void insertHoliday(String name, String startDate, String endDate) {
        // 입력된 날짜가 유효한지 확인
        if (!startDate.matches("\\d{4}-\\d{2}-\\d{2}")) {
            throw new IllegalArgumentException("Invalid date format. Expected format: YYYY-MM-DD");
        }
        
        String dateKey = "holiday:" + startDate;
        redisTemplate.opsForValue().set(dateKey, name);
        System.out.println("공휴일 입력 완료: " + name + " (" + startDate + ")");
    }
    

    // Redis에서 특정 날짜의 공휴일 정보를 조회하는 메서드
    public String getHoliday(String date) {
        return redisTemplate.opsForValue().get("holiday:" + date);
    }

    // Redis에서 모든 공휴일 정보를 Event 객체 리스트로 변환하여 가져오는 메서드
    public List<Event> getAllHolidaysFromRedisAsEvents() {
        Set<String> keys = redisTemplate.keys("holiday:*");

        return keys.stream()
                   .map(key -> {
                       String holidayName = redisTemplate.opsForValue().get(key);
                       Event event = new Event();
                       event.setSummary(holidayName);
                       event.setStart(new EventDateTime().setDate(new DateTime(key.substring(8)))); // 키에서 날짜 추출
                       return event;
                   })
                   .collect(Collectors.toList());
    }
    
    
}
