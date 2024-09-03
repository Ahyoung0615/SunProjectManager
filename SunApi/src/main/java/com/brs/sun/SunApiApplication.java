package com.brs.sun;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SunApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(SunApiApplication.class, args);
	}

}

