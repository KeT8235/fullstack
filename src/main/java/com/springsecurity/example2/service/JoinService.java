package com.springsecurity.example2.service;

import com.springsecurity.example2.dto.JoinDTO;
import com.springsecurity.example2.entity.User;
import com.springsecurity.example2.entity.UserRole;
import com.springsecurity.example2.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class JoinService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Transactional
    public void joinProcess(JoinDTO joinDTO) {

        String loginId = joinDTO.getLoginId();
        String nickname = joinDTO.getNickname();
        String rawPassword = joinDTO.getPassword();

        if (!StringUtils.hasText(loginId) || !StringUtils.hasText(rawPassword) || !StringUtils.hasText(nickname)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "아이디, 비밀번호, 닉네임을 모두 입력해주세요.");
        }

        if (userRepository.existsByLoginId(loginId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 존재하는 아이디입니다.");
        }

        if (userRepository.existsByNickname(nickname)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용 중인 닉네임입니다.");
        }

        // 2. 비밀번호 암호화 (필수)
        String encPassword = bCryptPasswordEncoder.encode(rawPassword);

        // 3. 권한 로직 처리 (모든 신규 가입자는 USER 역할 부여)
        UserRole role = UserRole.USER;

        // 4. 엔티티 생성 및 저장
        User user = User.builder()
                .loginId(loginId)
                .password(encPassword) // 암호화된 비번 저장
                .nickname(nickname)
                .role(role) // 항상 USER 역할로 저장
                .build();

        userRepository.save(Objects.requireNonNull(user));
    }
}