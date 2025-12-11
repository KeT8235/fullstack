package com.springsecurity.example2.dto;

import com.springsecurity.example2.entity.User;
import com.springsecurity.example2.entity.UserRole;
import lombok.Getter;

@Getter
public class UserResponseDTO {
    private final Long id;
    private final String loginId;
    private final String nickname;
    private final UserRole role;

    public UserResponseDTO(User user) {
        this.id = user.getId();
        this.loginId = user.getLoginId();
        this.nickname = user.getNickname();
        this.role = user.getRole();
    }
}
