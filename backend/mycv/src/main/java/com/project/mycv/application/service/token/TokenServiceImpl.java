package com.project.mycv.application.service.token;

import com.project.mycv.application.mapper.TokenMapper;
import com.project.mycv.config.exception.AuthorizedException;
import com.project.mycv.config.exception.ClientException;
import com.project.mycv.constant.MessageKeys;
import com.project.mycv.constant.type.HTypeTokenInvalid;
import com.project.mycv.domain.model.Token;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {
    private static final Logger LOGGER = LoggerFactory.getLogger(TokenServiceImpl.class);

    private final TokenMapper tokenMapper;

    @Override
    public Optional<Token> findByToken(String refreshToken) {
        return tokenMapper.findByToken(refreshToken);
    }

    @Override
    public Token getByToken(String refreshToken) {
        return findByToken(refreshToken).orElseThrow(() ->
                new AuthorizedException(HTypeTokenInvalid.REFRESH_TOKEN_INVALID.getValue(),
                        MessageKeys.TOKEN_NOT_FOUND));
    }

    @Override
    public boolean validateToken(String token) {
        Token refreshToken = getByToken(token);
        boolean valid = !refreshToken.isRevoked() && !refreshToken.isExpired();
        if (valid) {
            boolean isExpired = refreshToken.getExpiredDate().isBefore(LocalDateTime.now());
            if (isExpired) {
                LOGGER.info("Token {} is expired", token);
            }
            return !isExpired;
        }
        return false;
    }

    @Override
    public boolean revokeToken(String token) {
        Token refreshToken = getByToken(token);
        if (refreshToken.isRevoked() || refreshToken.isExpired()) {
            throw new AuthorizedException(HTypeTokenInvalid.REFRESH_TOKEN_INVALID.getValue(),
                    MessageKeys.AUTHORIZATION_FAIL);
        }
        LOGGER.info("Revoking token {}", token);
        return tokenMapper.revokeToken(token);
    }

    @Override
    public boolean expireToken(String token) {
        Token refreshToken = getByToken(token);
        if (refreshToken.isRevoked() || refreshToken.isExpired()) {
            throw new AuthorizedException(HTypeTokenInvalid.REFRESH_TOKEN_INVALID.getValue(),
                    MessageKeys.AUTHORIZATION_FAIL);
        }
        LOGGER.info("Expiring token {}", token);
        return tokenMapper.expireToken(token);
    }

    @Override
    public Token insert(Token entity) {
        Optional<Token> refreshToken = findByToken(entity.getRefreshToken());
        if (refreshToken.isPresent()) {
            throw new ClientException(MessageKeys.TOKEN_CREATE_FAILED);
        }
        boolean created = tokenMapper.insert(entity);
        if (!created) {
            LOGGER.error("Token insert failed");
            throw new ClientException(MessageKeys.TOKEN_CREATE_FAILED);
        }
        LOGGER.info("Token inserted successfully");
        return entity;
    }

    @Override
    public Token update(Token entity, String refreshToken) {
        return null;
    }

    @Override
    public void delete(String refreshToken) {
        Optional<Token> token = findByToken(refreshToken);
        if (token.isPresent()) {
            boolean deleted = tokenMapper.delete(refreshToken);
            if (deleted) {
                LOGGER.info("Delete token {} successfully.", refreshToken);
                return;
            }
            LOGGER.info("Delete token {} failed.", refreshToken);
        }
        LOGGER.error("Token delete not found {}.", refreshToken);
    }
}
