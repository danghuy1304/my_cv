package com.project.mycv.application.mapper;

import com.project.mycv.application.mapper.base.ReadableMapper;
import com.project.mycv.domain.dto.UserDTO;
import com.project.mycv.domain.dto.UserInsertDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Optional;

@Mapper
public interface UserMapper extends ReadableMapper<UserDTO, Long> {
    boolean insert(UserInsertDTO userInsertDTO);

    Optional<UserDTO> findByUsername(@Param("username") String username);

    Optional<UserDTO> findByEmail(@Param("email") String email);

    Optional<UserDTO> findByToken(@Param("token") String token);

    void updateStatus(@Param("id") Long id, @Param("status") Integer status);

    void updatePassword(@Param("id") Long id, @Param("password") String password);
}
