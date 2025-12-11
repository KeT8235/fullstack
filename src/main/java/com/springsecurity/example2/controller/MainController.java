package com.springsecurity.example2.controller;

import com.springsecurity.example2.config.PrincipalDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class MainController {

    @GetMapping("/user-info")
    public String userInfo(@AuthenticationPrincipal PrincipalDetails principalDetails) {
        return "현재 로그인한 유저: " + principalDetails.getUsername() + ", 닉네임: " + principalDetails.getNickname();
    }

    @GetMapping("/admin/data")
    public String adminData() {
        return "관리자만 볼 수 있는 데이터입니다.";
    }
}