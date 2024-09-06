package com.brs.sun.comm.swagger;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {

	@Bean
	public OpenAPI openAPI() {
		return new OpenAPI()
				   .components(new Components())
				   .info(apiInfo());
	}
	
	public Info apiInfo() {
		// 
		return new Info()
				   .title("SunGroupware Swagger")
				   .description("SunGroup Swagger")
				   .version("1.0.0");
	}
}





