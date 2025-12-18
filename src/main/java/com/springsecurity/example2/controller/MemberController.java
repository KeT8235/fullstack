package com.springsecurity.example2.controller;

import com.springsecurity.example2.config.JwtUtil;
import com.springsecurity.example2.config.PrincipalDetails;
import com.springsecurity.example2.dto.JoinDTO;
import com.springsecurity.example2.dto.LoginDTO;
import com.springsecurity.example2.service.JoinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MemberController {

    private final JoinService joinService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<String> join(@RequestBody JoinDTO joinDTO) {
        joinService.joinProcess(joinDTO);
        return ResponseEntity.ok("회원가입 성공");
    }

    // 로그인 (JWT 발급)
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO) {
        // 1. AuthenticationManager로 인증 시도
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.getLoginId(), loginDTO.getPassword())
        );

        // 2. 인증 성공 시, PrincipalDetails에서 사용자 정보 가져오기
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        String loginId = principalDetails.getUsername();
        String role = principalDetails.getAuthorities().iterator().next().getAuthority();
        String nickname = principalDetails.getNickname();

        // 3. JWT 토큰 생성 (nickname 포함)
        String token = jwtUtil.createToken(loginId, role, nickname);

        // 4. 토큰을 Body에 담아 반환
        return ResponseEntity.ok().body(token);
    }
}
