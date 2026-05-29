package com.project.mycv.application.service.user;

import com.project.mycv.application.response.UserLoginResponse;
import com.project.mycv.application.service.base.ReadableService;
import com.project.mycv.domain.dto.ChangePasswordDTO;
import com.project.mycv.domain.dto.UserDTO;
import com.project.mycv.domain.dto.UserLoginDTO;
import com.project.mycv.domain.dto.UserRegisterDTO;

public interface UserService extends ReadableService<UserDTO, Long> {
    boolean register(UserRegisterDTO userRegisterDTO);

    UserLoginResponse login(UserLoginDTO userLoginDTO);

    void logout(String refreshToken);

    String refreshToken(String refreshToken);

    void changePassword(Long userId, ChangePasswordDTO dto);
}
