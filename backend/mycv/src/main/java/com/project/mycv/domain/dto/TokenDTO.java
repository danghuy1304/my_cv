package com.project.mycv.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenDTO {
    private Long id;
    private UserDTO userDto;
    private UUID refreshToken;
    private boolean isRevoked;
    private boolean isExpired;
    private String deviceInfo;
    private LocalDateTime expiredAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
