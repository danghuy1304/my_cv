package com.project.mycv.application.service.user;

import com.project.mycv.application.mapper.UserMapper;
import com.project.mycv.application.response.UserLoginResponse;
import com.project.mycv.config.exception.ClientException;
import com.project.mycv.config.exception.NotFoundException;
import com.project.mycv.config.security.CustomUserDetailService;
import com.project.mycv.config.security.CustomUserDetails;
import com.project.mycv.config.security.JwtTokenProvider;
import com.project.mycv.config.security.password.CustomPasswordEncoder;
import com.project.mycv.constant.MessageKeys;
import com.project.mycv.domain.dto.UserDTO;
import com.project.mycv.domain.dto.UserLoginDTO;
import com.project.mycv.domain.dto.UserRegisterDTO;
import com.project.mycv.domain.dto.paginate.PaginationDTO;
import com.project.mycv.utility.PaginationUtility;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserMapper userMapper;
    private final CustomUserDetailService userDetailService;
    private final CustomPasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public boolean register(UserRegisterDTO userRegisterDTO) {
        return false;
    }

    @Override
    public UserLoginResponse login(UserLoginDTO userLoginDTO) {
        String username = userLoginDTO.getUsername();
        String password = userLoginDTO.getPassword();
        LOGGER.info("Start login with username: {}", username);
        UserDetails userDetails = userDetailService.loadUserByUsername(username);
        UserDTO userDto = ((CustomUserDetails) userDetails).getUserDto();
        if (!passwordEncoder.matches(password, userDto.getPassword())) {
            throw new ClientException(MessageKeys.USER_PASSWORD_WRONG);
        }

        boolean isActive = userDto.getStatus() == 1;
        if (!isActive) {
            throw new ClientException(MessageKeys.USER_INACTIVE);
        }
        String accessToken = jwtTokenProvider.generateAccessToken(userDto);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDto);
        return new UserLoginResponse(userDto.getUsername(), accessToken, refreshToken);
    }

    @Override
    public String refreshToken(String refreshToken) {
        return "";
    }

    @Override
    public PaginationDTO<UserDTO> getAll(Integer page, Integer pageSize) {
        return PaginationUtility.paginate(userMapper::findAll, page, pageSize);
    }

    @Override
    public Optional<UserDTO> findById(Long id) {
        return userMapper.findById(id);
    }

    @Override
    public UserDTO getById(Long id) {
        return findById(id).orElseThrow(() -> new NotFoundException(MessageKeys.USER_NOT_FOUND));
    }
}
