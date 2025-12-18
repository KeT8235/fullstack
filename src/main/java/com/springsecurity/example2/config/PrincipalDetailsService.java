package com.springsecurity.example2.config;

import com.springsecurity.example2.entity.User;
import com.springsecurity.example2.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PrincipalDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("로그인 시도 아이디: " + username);

        User userEntity = userRepository.findByLoginId(username)
                .orElseThrow(() -> new UsernameNotFoundException("해당 아이디를 찾을 수 없습니다: " + username));

        // UserDetails 구현체 반환 -> 시큐리티 세션에 저장됨
        return new PrincipalDetails(userEntity);
    }
}