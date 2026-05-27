package com.project.mycv.application.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserLoginResponse {
    private String username;
    private String accessToken;
    private String refreshToken;
}
