package com.project.mycv.config.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ConflictException extends RuntimeException {
    private final HttpStatus status;

    private String type;

    private final String message;

    /**
     * Constructor has argument.
     *
     * @param message the message
     */
    public ConflictException(String message) {
        super(message);
        this.status = HttpStatus.CONFLICT;
        this.message = message;
    }

    /**
     * Constructor has argument.
     *
     * @param type    the type
     * @param message the message
     */
    public ConflictException(String type, String message) {
        super(message);
        this.status = HttpStatus.CONFLICT;
        this.type = type;
        this.message = message;
    }
}
