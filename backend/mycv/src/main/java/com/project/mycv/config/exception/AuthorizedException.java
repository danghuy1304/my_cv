package com.project.mycv.config.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class AuthorizedException extends RuntimeException {
    private final HttpStatus status;

    private String type;

    private final String message;

    /**
     * Instantiates a new Not found exception.
     *
     * @param message the message
     */
    public AuthorizedException(String message) {
        super(message);
        this.status = HttpStatus.UNAUTHORIZED;
        this.message = message;
    }

    /**
     * Instantiates a new Not found exception.
     *
     * @param type    the type
     * @param message the message
     */
    public AuthorizedException(String type, String message) {
        super(message);
        this.status = HttpStatus.UNAUTHORIZED;
        this.type = type;
        this.message = message;
    }
}
