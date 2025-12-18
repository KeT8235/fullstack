package com.springsecurity.example2.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // application.properties에서 jwt.secret 값을 가져옴
    @Value("${jwt.secret}")
    private String secretKey;

    // application.properties에서 jwt.expiration 값을 가져옴
    @Value("${jwt.expiration}")
    private long expirationTime;

    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    // 1. 토큰 생성
    public String createToken(String loginId, String role, String nickname) {
        Claims claims = Jwts.claims();
        claims.put("loginId", loginId);
        claims.put("role", role);
        claims.put("nickname", nickname);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 2. 토큰에서 LoginId 추출
    public String getLoginId(String token) {
        return parseClaims(token).get("loginId", String.class);
    }

    // 3. 토큰 유효성 검사
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}