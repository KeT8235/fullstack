package com.springsecurity.example2.dto;

import lombok.Data;

@Data
public class LoginDTO {
    private String loginId;
    private String password;
}