package com.project.mycv.application.mapper;

import com.project.mycv.domain.model.Token;
import org.apache.ibatis.annotations.Mapper;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Mapper
public interface TokenMapper {
    Token insert(Token token);

    Optional<Token> findByToken(UUID refreshToken);

    int update(UUID refreshToken, boolean isRevoked, boolean isExpired, LocalDateTime expiryDate);

    int delete(UUID refreshToken);

    int revokeToken(UUID refreshToken);
}
