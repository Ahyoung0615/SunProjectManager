package com.brs.sun.security.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final String FILE_DIRECTORY = "C:/Users/GDJ/git/SunProjectManager/SunApi/src/main/webapp/memberImage/";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // /uploads/** URL 경로를 실제 파일 시스템 경로로 매핑
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + FILE_DIRECTORY);
    }
}