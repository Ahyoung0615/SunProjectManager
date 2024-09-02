package com.brs.sun.api;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class FeignConfiguration {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
    @Bean
    public ClovaOcrClient clovaOcrClient() {
    	return new ClovaOcrClientRestTemplate(restTemplate());
    }
	
}
