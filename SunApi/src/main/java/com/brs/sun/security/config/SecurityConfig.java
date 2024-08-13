package com.brs.sun.security.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig{

    @Bean
    public BCryptPasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
        		.cors().and().csrf().disable()
        		.authorizeHttpRequests(authorize -> authorize
                //.antMatchers("/주소입력").hasRole("")<< 만약 입력 1을 넣으면 prefix로 ROLE_가 붙으면서 새로운 권한이 생김
        				.requestMatchers("/admin/**").hasRole("11")  // ADMIN 권한이 있는 사용자만 /admin/** 경로에 접근 가능
                        .requestMatchers("/user/**").authenticated()    // 인증된 사용자만 /user/** 경로에 접근 가능
                        .anyRequest().permitAll()                      // 그 외의 모든 요청은 누구나 접근 가능
                    )
                    .formLogin(formLogin -> formLogin
                        .loginPage("/login")                            // 사용자 정의 로그인 페이지 설정
                        .loginProcessingUrl("/loginProc")               // 로그인 처리를 담당할 엔드포인트 설정
                        .usernameParameter("email")                     // 이메일을 로그인 ID로 사용
                        .defaultSuccessUrl("/loginOk", true)            // 로그인 성공 시 리디렉션할 URL 설정
                    )
                    .logout(logout -> logout
                        .logoutUrl("/logout")                           // 로그아웃 요청 엔드포인트 설정
                        .logoutSuccessUrl("/logoutOk")                  // 로그아웃 성공 시 리디렉션할 URL 설정
                        .invalidateHttpSession(true)                    // 로그아웃 시 세션 무효화
                        .deleteCookies("JSESSIONID")                    // 세션 쿠키 삭제
                    );

                // CORS 필터를 추가
                http.addFilterBefore(corsFilter(), UsernamePasswordAuthenticationFilter.class);

                return http.build();
            }

            @Bean
            public CorsFilter corsFilter() {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
                config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
                config.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", config);

                return new CorsFilter(source);
            }
}
