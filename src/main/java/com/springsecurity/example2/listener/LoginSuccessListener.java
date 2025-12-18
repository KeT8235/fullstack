package com.springsecurity.example2.listener;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationListener;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@Slf4j // Lombok을 사용하여 로그 기록
public class LoginSuccessListener implements ApplicationListener<AuthenticationSuccessEvent> {

    @Override
    public void onApplicationEvent(@NonNull AuthenticationSuccessEvent event) {
        // 인증 성공 이벤트 발생 시 호출됩니다.
        String userName;
        Object principal = event.getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            userName = ((UserDetails) principal).getUsername();
        } else {
            userName = principal.toString();
        }
        log.info("사용자 '{}'가 성공적으로 로그인했습니다. 인증 타입: {}", userName, event.getAuthentication().getClass().getSimpleName());
        // 여기에 추가적인 로직 (예: 로그인 시간 기록, 세션 정보 저장 등)을 구현할 수 있습니다.
    }
}
