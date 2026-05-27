package com.project.mycv.config.security;

import com.project.mycv.application.mapper.UserMapper;
import com.project.mycv.constant.MessageKeys;
import com.project.mycv.domain.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(@NonNull String username) throws UsernameNotFoundException {
        UserDTO userDTO = userMapper.findByUsername(username).orElseThrow(()
                -> new UsernameNotFoundException(MessageKeys.USER_NOT_FOUND));
        return new CustomUserDetails(userDTO);
    }
}
