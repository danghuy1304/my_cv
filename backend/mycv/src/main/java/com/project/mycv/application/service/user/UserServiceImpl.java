package com.project.mycv.application.service.user;

import com.project.mycv.application.mapper.UserMapper;
import com.project.mycv.application.response.UserLoginResponse;
import com.project.mycv.application.service.role.RoleService;
import com.project.mycv.application.service.token.TokenService;
import com.project.mycv.config.exception.AuthorizedException;
import com.project.mycv.config.exception.ClientException;
import com.project.mycv.config.exception.MultipleConflictException;
import com.project.mycv.config.exception.NotFoundException;
import com.project.mycv.config.security.CustomUserDetailService;
import com.project.mycv.config.security.CustomUserDetails;
import com.project.mycv.config.security.JwtTokenProvider;
import com.project.mycv.config.security.password.CustomPasswordEncoder;
import com.project.mycv.constant.MessageKeys;
import com.project.mycv.constant.type.HTypeTokenInvalid;
import com.project.mycv.domain.dto.ChangePasswordDTO;
import com.project.mycv.domain.dto.UserDTO;
import com.project.mycv.domain.dto.UserInsertDTO;
import com.project.mycv.domain.dto.UserLoginDTO;
import com.project.mycv.domain.dto.UserRegisterDTO;
import com.project.mycv.domain.dto.paginate.PaginationDTO;
import com.project.mycv.domain.model.Role;
import com.project.mycv.utility.PaginationUtility;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserMapper userMapper;
    private final CustomUserDetailService userDetailService;
    private final CustomPasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final TokenService tokenService;
    private final RoleService roleService;

    @Override
    public boolean register(UserRegisterDTO userRegisterDTO) {
        List<String> errors = new ArrayList<>();

        if (userMapper.findByUsername(userRegisterDTO.getUsername()).isPresent()) {
            errors.add(MessageKeys.USERNAME_ALREADY_EXISTS);
        }
        if (userMapper.findByEmail(userRegisterDTO.getEmail()).isPresent()) {
            errors.add(MessageKeys.EMAIL_ALREADY_EXISTS);
        }
        if (!errors.isEmpty()) {
            throw new MultipleConflictException(errors);
        }

        Role role = roleService.findByName("USER");
        UserInsertDTO userInsertDTO = new UserInsertDTO();
        userInsertDTO.setUsername(userRegisterDTO.getUsername());
        userInsertDTO.setEmail(userRegisterDTO.getEmail());
        userInsertDTO.setPassword(passwordEncoder.encode(userRegisterDTO.getPassword()));
        userInsertDTO.setRoleId(role.getId());
        return userMapper.insert(userInsertDTO);
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
    public void logout(String refreshToken) {
        LOGGER.info("Start logout with refresh token: {}", refreshToken);
        tokenService.revokeToken(refreshToken);
        LOGGER.info("End logout with refresh token: {}", refreshToken);
    }

    @Override
    public String refreshToken(String refreshToken) {
        boolean validateToken = tokenService.validateToken(refreshToken);
        if (!validateToken) {
            throw new AuthorizedException(
                    HTypeTokenInvalid.REFRESH_TOKEN_INVALID.getValue(),
                    MessageKeys.AUTHORIZATION_FAIL
            );
        }
        UserDTO userDTO = userMapper.findByToken(refreshToken).orElseThrow(() ->
                new NotFoundException(MessageKeys.USER_NOT_FOUND));
        return jwtTokenProvider.generateAccessToken(userDTO);
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

    @Override
    public void changePassword(Long userId, ChangePasswordDTO dto) {
        UserDTO user = getById(userId);
        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new ClientException(MessageKeys.OLD_PASSWORD_WRONG);
        }
        String encoded = passwordEncoder.encode(dto.getNewPassword());
        userMapper.updatePassword(userId, encoded);
    }
}
