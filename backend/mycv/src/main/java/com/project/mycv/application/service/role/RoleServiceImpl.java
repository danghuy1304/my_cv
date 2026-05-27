package com.project.mycv.application.service.role;

import com.project.mycv.application.mapper.RoleMapper;
import com.project.mycv.config.exception.NotFoundException;
import com.project.mycv.constant.MessageKeys;
import com.project.mycv.domain.dto.paginate.PaginationDTO;
import com.project.mycv.domain.model.Role;
import com.project.mycv.utility.PaginationUtility;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private static final Logger LOGGER = LoggerFactory.getLogger(RoleServiceImpl.class);

    private final RoleMapper roleMapper;

    @Override
    public PaginationDTO<Role> getAll(Integer page, Integer pageSize) {
        return PaginationUtility.paginate(
                roleMapper::findAll,
                page,
                pageSize
        );
    }

    @Override
    public Optional<Role> findById(Long id) {
        return roleMapper.findById(id);
    }

    @Override
    public Role getById(Long id) {
        return findById(id).orElseThrow(
                () -> new NotFoundException(MessageKeys.ROLE_NOT_FOUND)
        );
    }

    @Override
    public Role findByName(String name) {
        return roleMapper.findByName(name).orElseThrow(
                () -> new NotFoundException(MessageKeys.ROLE_NOT_FOUND)
        );
    }
}
