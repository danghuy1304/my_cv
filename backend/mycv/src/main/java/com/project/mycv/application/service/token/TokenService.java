package com.project.mycv.application.service.token;

import com.project.mycv.application.service.base.CrudService;
import com.project.mycv.domain.model.Token;

import java.util.Optional;

public interface TokenService extends CrudService<Token, String> {
    Optional<Token> findByToken(String refreshToken);

    Token getByToken(String refreshToken);

    boolean validateToken(String token);

    boolean revokeToken(String token);

    boolean expireToken(String token);
}
