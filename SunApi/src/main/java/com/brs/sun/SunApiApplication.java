package com.brs.sun;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
public class SunApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(SunApiApplication.class, args);
	}

}

