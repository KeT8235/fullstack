package com.springsecurity.example2.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // 메소드 시큐리티 활성화
@RequiredArgsConstructor
@Order(2) // 설정 순서 지정 (2순위)
public class FormSecurityConfig {

    // BCryptPasswordEncoder는 SecurityBeansConfig에서 관리

    @Bean
    public SecurityFilterChain formFilterChain(HttpSecurity http) throws Exception {

        // "/api/**" 경로를 제외한 모든 요청에 이 필터체인 적용
        http.securityMatcher("/**")
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/**").permitAll() // API 경로는 FormSecurityConfig에서 처리하지 않음 (ApiSecurityConfig가 처리)
                        .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll() // 정적 리소스 허용
                        .requestMatchers(PathRequest.toH2Console()).permitAll()
                        .requestMatchers("/", "/login", "/join", "/error").permitAll() // 메인, 로그인, 회원가입 페이지 허용
                        .requestMatchers("/admin/**").hasRole("ADMIN") // /admin/** 은 ADMIN 역할만
                        .anyRequest().authenticated() // 그 외 모든 요청은 인증 필요
                )
                .formLogin(form -> form
                        .loginPage("/login") // 사용자 정의 로그인 페이지
                        .loginProcessingUrl("/login") // 로그인 처리 URL
                        .defaultSuccessUrl("/", true) // 로그인 성공 시 리디렉션될 기본 URL
                        .permitAll() // 로그인 페이지는 모두 접근 가능
                )
                .logout(logout -> logout
                        .logoutUrl("/logout") // 로그아웃 처리 URL
                        .logoutSuccessUrl("/") // 로그아웃 성공 시 리디렉션될 URL
                        .permitAll()
                );

        // H2 콘솔 허용을 위한 설정 (X-Frame-Options 비활성화)
        http.headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin));

        return http.build();
    }
}
