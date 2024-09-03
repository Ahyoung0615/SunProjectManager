package com.brs.sun.security.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig{

	@Autowired
	private UserDetailsServiceImpl userDetailsService; 
	
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
        		.cors(cors -> cors
        				.configurationSource(corsConfigurationSource())
        		)
        		.csrf(csrf -> csrf.disable())
        		.authorizeHttpRequests(authorize -> authorize
                //.antMatchers("/주소입력").hasRole("")<< 만약 입력 1을 넣으면 prefix로 ROLE_가 붙으면서 새로운 권한이 생김
        				.requestMatchers("/ws/**").permitAll()
        				.requestMatchers("/memberList").hasRole("A")  // ADMIN 권한이 있는 사용자만 /admin/** 경로에 접근 가능
                        .requestMatchers("/user/**").authenticated()    // 인증된 사용자만 /user/** 경로에 접근 가능
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/member").permitAll()     // 이미지 미리보기 허용
                        .requestMatchers("/memberImage/**").permitAll()
                        .requestMatchers("src/main/resources/static/boardFile").permitAll()       
                        .anyRequest().permitAll()                      // 그 외의 모든 요청은 누구나 접근 가능
                )
                .formLogin(formLogin -> formLogin
                        .loginPage("/login")                            // 사용자 정의 로그인 페이지 설정
                        .loginProcessingUrl("/loginProc")               // 로그인 처리를 담당할 엔드포인트 설정
                        .usernameParameter("empcode")     // empcode을 로그인 ID로 사용
                        .passwordParameter("emppw")       //emppw를 로그인 PW로 사용 (설정안할시 password고정)
                        .defaultSuccessUrl("/loginOk", true)            // 로그인 성공 시 리디렉션할 URL 설정
                )
                    .logout(logout -> logout
                        .logoutUrl("/logout")                           // 로그아웃 요청 엔드포인트 설정
                        .deleteCookies("JSESSIONID" ,"remember-me-cookie")	// 세션 쿠키 삭제
                        .invalidateHttpSession(true)                    // 로그아웃 시 세션 무효화
                        .logoutSuccessUrl("/logoutOk")                  // 로그아웃 성공 시 리디렉션할 URL 설정
                    )
                    .sessionManagement(sessionManagement -> sessionManagement
                            .maximumSessions(1) // 사용자당 최대 세션 수를 1로 설정
                            .maxSessionsPreventsLogin(false) // 최대 세션 수 초과 시 새로운 로그인 허용 여부
                            .expiredUrl("/")
                    )
                    .sessionManagement(session -> session
                    		.invalidSessionUrl("/")
                    )
                    .rememberMe(rememberMe -> rememberMe
                    		.key("rememberMe")
                    		.tokenValiditySeconds(3600)
                    		.userDetailsService(userDetailsService)
                    		.rememberMeParameter("rememberMe")
                    		.rememberMeCookieName("remember-me-cookie")
                    );
                    

                // CORS 필터를 추가
                http.addFilterBefore(corsFilter(), UsernamePasswordAuthenticationFilter.class);

                return http.build();
            }

    
		    @Bean
		    public SessionRegistry sessionRegistry() {
		        return new SessionRegistryImpl();
		    }
		
		    @Bean
		    public HttpSessionEventPublisher httpSessionEventPublisher() {
		        return new HttpSessionEventPublisher();
		    }
		    @Bean
		    public CorsConfigurationSource corsConfigurationSource() {
		        CorsConfiguration config = new CorsConfiguration();
		        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
		        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		        config.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
		        config.setAllowCredentials(true);

		        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		        source.registerCorsConfiguration("/**", config);

		        return source;
		    }

		    @Bean
		    public CorsFilter corsFilter() {
		        return new CorsFilter(corsConfigurationSource());
		    }
		    @Bean
		    public SecurityFilterChain webSocketSecurityFilterChain(HttpSecurity http) throws Exception {
		        http
		            .authorizeHttpRequests(authorize -> authorize
		                .requestMatchers("/ws/chat").authenticated() // 웹소켓 엔드포인트 보호
		            );

		        return http.build();
		    }
}
