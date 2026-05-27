package com.project.mycv.application.service.token;

import com.project.mycv.application.service.base.CrudService;
import com.project.mycv.domain.model.Token;

import java.util.Optional;
import java.util.UUID;

public interface TokenService extends CrudService<Token, UUID> {
    Optional<Token> findByToken(UUID refreshToken);

    boolean validateToken(UUID token);

    boolean revokeToken(UUID token);
}
