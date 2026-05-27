package com.project.mycv.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenUpdateDTO {
    private String refreshToken;
    private boolean isRevoked;
    private boolean isExpired;
    private String deviceInfo;
}
