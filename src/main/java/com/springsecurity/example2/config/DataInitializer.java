package com.springsecurity.example2.config;

import com.springsecurity.example2.entity.User;
import com.springsecurity.example2.entity.UserRole;
import com.springsecurity.example2.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        final String adminLoginId = "junee1205";
        final String adminPassword = "Rlawnstn1205!@";
        final String adminNickname = "김준수";

        // 관리자 계정이 이미 존재하는지 확인
        var existingAdmin = userRepository.findByLoginId(adminLoginId);
        if (existingAdmin.isEmpty()) {
            log.info("관리자 계정 'junee1205'를 생성합니다.");
            User admin = User.builder()
                    .loginId(adminLoginId)
                    .password(passwordEncoder.encode(adminPassword))
                    .nickname(adminNickname)
                    .role(UserRole.ADMIN)
                    .build();
                userRepository.save(Objects.requireNonNull(admin));
        } else {
            User admin = existingAdmin.get();
            boolean changed = false;

            if (!adminNickname.equals(admin.getNickname())) {
                admin.updateNickname(adminNickname);
                changed = true;
            }
            if (admin.getRole() != UserRole.ADMIN) {
                admin.updateRole(UserRole.ADMIN);
                changed = true;
            }

            if (changed) {
                userRepository.save(admin);
                log.info("관리자 계정 'junee1205' 정보를 갱신했습니다.");
            } else {
                log.info("관리자 계정 'junee1205'가 이미 존재하여 생성하지 않습니다.");
            }
        }
    }
}
