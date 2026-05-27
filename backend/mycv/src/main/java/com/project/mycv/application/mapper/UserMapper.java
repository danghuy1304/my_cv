package com.project.mycv.application.mapper;

import com.project.mycv.domain.dto.UserDTO;
import com.project.mycv.domain.model.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserMapper {
    int insert(User user);

    List<UserDTO> findAll();

    Optional<UserDTO> findByUsername(@Param("username") String username);

    Optional<UserDTO> findById(@Param("id") Long id);
}
