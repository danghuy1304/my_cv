package com.project.mycv.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenDTO {
    private Long id;
    private UserDTO userDto;
    private String refreshToken;
    private boolean isRevoked;
    private boolean isExpired;
    private String deviceInfo;
    private LocalDateTime expiredAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
