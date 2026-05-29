package com.project.mycv.config.exception;

import com.project.mycv.application.response.base.RestResponse;
import com.project.mycv.config.language.LocalizationUtils;
import com.project.mycv.constant.MessageKeys;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.LocaleResolver;

import java.util.List;

@RestControllerAdvice
@RequiredArgsConstructor
public class RestExceptionHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(RestExceptionHandler.class);

    private final MessageSource messageSource;
    private final LocaleResolver localeResolver;
    private final LocalizationUtils localizationUtils;

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<?> handleNotFoundException(NotFoundException e) {
        LOGGER.error("NotFoundException: ", e);
        return RestResponse.error(e.getStatus(),
                e.getClass().getSimpleName(),
                localizationUtils.getLocalizeMessage(e.getMessage()));
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<?> handleUsernameNotFoundException(UsernameNotFoundException e) {
        LOGGER.error("UsernameNotFoundException: ", e);
        return RestResponse.error(HttpStatus.NOT_FOUND,
                e.getClass().getSimpleName(),
                localizationUtils.getLocalizeMessage(e.getMessage()));
    }

    @ExceptionHandler(ConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<?> handleConflictException(ConflictException e) {
        LOGGER.error("ConflictException: ", e);
        return RestResponse.error(e.getStatus(),
                e.getClass().getSimpleName(),
                localizationUtils.getLocalizeMessage(e.getMessage()));
    }

    @ExceptionHandler(MultipleConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<?> handleMultipleConflictException(MultipleConflictException e) {
        LOGGER.error("MultipleConflictException: ", e);
        List<String> errorMessages = e.getMessages()
                .stream()
                .map(localizationUtils::getLocalizeMessage)
                .toList();
        return RestResponse.errors(e.getStatus(), "MultipleConflictException", errorMessages);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<?> handleValidInputException(ConstraintViolationException e) {
        LOGGER.error("ConstraintViolationException: ", e);
        return RestResponse.error(HttpStatus.BAD_REQUEST,
                e.getClass().getSimpleName(),
                localizationUtils.getLocalizeMessage(e.getMessage()));
    }

    @ExceptionHandler(ClientException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<?> handleClientException(ClientException e) {
        LOGGER.error("ClientException: ", e);
        return RestResponse.error(HttpStatus.BAD_REQUEST,
                e.getClass().getSimpleName(),
                localizationUtils.getLocalizeMessage(e.getMessage()));
    }

    @ExceptionHandler(AuthorizedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<?> handleAuthorizedException(AuthorizedException e) {
        LOGGER.error("AuthorizedException: ", e);
        return RestResponse.error(HttpStatus.UNAUTHORIZED,
                e.getType(),
                localizationUtils.getLocalizeMessage(e.getMessage()));
    }

    @ExceptionHandler(BindException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<?> handleBindException(BindException e) {
        List<String> errorMessages = e.getFieldErrors()
                .stream()
                .map(error -> localizationUtils.getLocalizeMessage(error.getDefaultMessage()))
                .toList();
        LOGGER.error("BindException: ", e);
        return RestResponse.errors(HttpStatus.BAD_REQUEST, "ValidationError", errorMessages);
    }

    @ExceptionHandler(HttpClientErrorException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseEntity<?> handleHttpClientErrorException(HttpClientErrorException e) {
        LOGGER.error("HttpClientErrorException: ", e);
        return RestResponse.error(HttpStatus.FORBIDDEN,
                e.getClass().getSimpleName(),
                localizationUtils.getLocalizeMessage(e.getMessage()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseEntity<?> handleAccessDeniedSecurityException(AccessDeniedException e) {
        LOGGER.error("AccessDeniedException: ", e);
        return RestResponse.error(HttpStatus.FORBIDDEN,
                e.getClass().getSimpleName(),
                localizationUtils.getLocalizeMessage(MessageKeys.ACCESS_DENIED));
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<?> handleRuntimeException(RuntimeException e) {
        LOGGER.error("RuntimeException: ", e);
        return RestResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,
                e.getClass().getSimpleName(),
                localizationUtils.getLocalizeMessage(MessageKeys.INTERNAL_SERVER_ERROR));
    }
}
