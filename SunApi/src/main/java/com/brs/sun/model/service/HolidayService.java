package com.brs.sun.model.service;

import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Events;
import com.google.api.services.calendar.model.Event;

import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class HolidayService {

    private static final String APPLICATION_NAME = "groupware";
    private static final String CREDENTIALS_FILE_PATH = "client_secret.json";  // 파일 이름만 지정

    public List<Event> getHolidays() throws GeneralSecurityException, IOException {
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
                .setApplicationName(APPLICATION_NAME)
                .build();

            // Google Calendar API에서 공휴일 데이터 가져오기
            Events events = service.events().list("ko.south_korea#holiday@group.v.calendar.google.com")
                .setTimeMin(new DateTime(new GregorianCalendar().get(java.util.Calendar.YEAR)+"-01-01T00:00:00Z"))
                .setTimeMax(new DateTime(new GregorianCalendar().get(java.util.Calendar.YEAR)+"-12-31T00:00:00Z")) // 1년치 공휴일 가져오기
                .setOrderBy("startTime")
                .setSingleEvents(true)
                .execute();

            return events.getItems();
        }
    }
}
