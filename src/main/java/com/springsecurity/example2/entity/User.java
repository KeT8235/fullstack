package com.springsecurity.example2.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name="UserMember")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String loginId;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String nickname;

    // 3. Enum 타입 매핑 설정
    @Enumerated(EnumType.STRING)
    private UserRole role;

    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    public void updateRole(UserRole role) {
        this.role = role;
    }
}