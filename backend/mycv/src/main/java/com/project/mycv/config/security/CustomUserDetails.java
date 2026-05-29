package com.project.mycv.config.security;

import com.project.mycv.domain.dto.UserDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {
    private final UserDTO userDto;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (userDto.getRole() == null || userDto.getRole().getRoleName() == null) {
            return List.of();
        }
        // Trả về quyền dạng chuỗi, ví dụ: "ROLE_ADMIN"
        return List.of(new SimpleGrantedAuthority("ROLE_" + userDto.getRole().getRoleName()));
    }

    @Override
    public String getPassword() {
        return userDto.getPassword();
    }

    @Override
    public String getUsername() {
        return userDto.getUsername();
    }

}
