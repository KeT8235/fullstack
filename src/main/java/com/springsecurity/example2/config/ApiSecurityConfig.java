package com.springsecurity.example2.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Order(1) // 설정 순서 지정 (1순위)
public class ApiSecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;


    // BCryptPasswordEncoder 빈 등록
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // AuthenticationManager 빈 등록
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173", "http://localhost:5174")); // 3000, 5173, 5174 포트 허용
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {

        // API 경로에만 이 설정을 적용
        http.securityMatcher("/api/**");

        // 0. CORS 설정
        http.cors(Customizer.withDefaults());

        // 1. CSRF 비활성화
        http.csrf(AbstractHttpConfigurer::disable);

        // 2. Form Login 및 HttpBasic 비활성화
        http.formLogin(AbstractHttpConfigurer::disable);
        http.httpBasic(AbstractHttpConfigurer::disable);

        // 3. 세션 사용 안 함 (STATELESS) 설정
        http.sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        );

        // 4. 권한 설정
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/login", "/api/join").permitAll() // 로그인, 회원가입 허용
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/articles", "/api/articles/**").permitAll() // 게시글 읽기 허용
                .requestMatchers("/api/admin/**").hasRole("ADMIN") // 관리자만 접근 가능
                .anyRequest().authenticated()
        );

        // 5. JWT 필터 등록
        http.addFilterBefore(new JwtFilter(userDetailsService, jwtUtil), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}