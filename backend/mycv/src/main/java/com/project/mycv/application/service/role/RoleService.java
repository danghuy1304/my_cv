package com.project.mycv.application.service.role;

import com.project.mycv.application.service.base.ReadableService;
import com.project.mycv.domain.model.Role;

public interface RoleService extends ReadableService<Role, Long> {
    Role findByName(String name);
}
