package com.project.mycv.application.mapper;

import com.project.mycv.application.mapper.base.ReadableMapper;
import com.project.mycv.domain.model.Role;
import org.apache.ibatis.annotations.Mapper;

import java.util.Optional;

@Mapper
public interface RoleMapper extends ReadableMapper<Role, Long> {
    Optional<Role> findByName(String name);
}
