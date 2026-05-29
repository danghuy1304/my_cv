package com.project.mycv.web.controller;

import com.project.mycv.application.response.UserLoginResponse;
import com.project.mycv.application.response.base.RestResponse;
import com.project.mycv.application.service.user.UserService;
import com.project.mycv.config.exception.AuthorizedException;
import com.project.mycv.config.security.CustomUserDetails;
import com.project.mycv.constant.CookieKeyConstant;
import com.project.mycv.constant.MessageKeys;
import com.project.mycv.domain.dto.ChangePasswordDTO;
import com.project.mycv.domain.dto.UserLoginDTO;
import com.project.mycv.domain.dto.UserRegisterDTO;
import com.project.mycv.utility.CookieUtility;
import com.project.mycv.web.base.RestAPI;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@RestAPI("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final CookieUtility cookieUtility;

    @Value("${jwt.expiration.refresh-token}")
    private int REFRESH_TOKEN_MAX_AGE;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegisterDTO userRegisterDTO) {
        userService.register(userRegisterDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody UserLoginDTO userLoginDTO,
            HttpServletResponse response
    ) {
        UserLoginResponse userLoginResponse = userService.login(userLoginDTO);
        Cookie refreshTokenCookie = cookieUtility.setCookieWithoutHttpOnly(
                CookieKeyConstant.REFRESH_TOKEN,
                userLoginResponse.getRefreshToken(),
                REFRESH_TOKEN_MAX_AGE
        );
        Cookie isLoggedInCookie = cookieUtility.setCookieWithoutHttpOnly(
                CookieKeyConstant.FLAG_IS_LOGGED_IN,
                "1",
                REFRESH_TOKEN_MAX_AGE
        );
        response.addCookie(refreshTokenCookie);
        response.addCookie(isLoggedInCookie);
        return RestResponse.success(userLoginResponse);
    }

    /**
     * POST /api/v1/users/refresh-token
     * Đọc refreshToken từ cookie (set lúc login), trả về accessToken mới.
     * Bypass JWT filter vì access token có thể đã hết hạn.
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(
            @CookieValue(name = CookieKeyConstant.REFRESH_TOKEN, required = false)
            String refreshToken
    ) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new AuthorizedException(MessageKeys.AUTHORIZATION_FAIL);
        }
        String newAccessToken = userService.refreshToken(refreshToken);
        return RestResponse.success(Map.of("accessToken", newAccessToken));
    }

    /**
     * POST /api/v1/users/logout
     * Revoke refresh token trong DB, xóa cả 2 cookie.
     * Yêu cầu JWT hợp lệ.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @CookieValue(name = CookieKeyConstant.REFRESH_TOKEN, required = false)
            String refreshToken,
            HttpServletResponse response
    ) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            userService.logout(refreshToken);
        }
        cookieUtility.deleteCookie(response, CookieKeyConstant.REFRESH_TOKEN);
        cookieUtility.deleteCookie(response, CookieKeyConstant.FLAG_IS_LOGGED_IN);
        return ResponseEntity.ok().build();
    }

    /**
     * GET /api/v1/users/me
     * Returns the full UserDTO of the currently authenticated user.
     * Requires a valid JWT (NOT in bypass-routes.yml).
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null
                || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new AuthorizedException(MessageKeys.AUTHORIZATION_FAIL);
        }
        return RestResponse.success(userDetails.getUserDto());
    }

    /**
     * PUT /api/v1/users/change-password
     * Đổi mật khẩu user hiện tại. Cần Bearer token hợp lệ.
     */
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordDTO dto,
            Authentication authentication
    ) {
        if (authentication == null
                || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new AuthorizedException(MessageKeys.AUTHORIZATION_FAIL);
        }
        userService.changePassword(userDetails.getUserDto().getId(), dto);
        return ResponseEntity.ok().build();
    }
}
