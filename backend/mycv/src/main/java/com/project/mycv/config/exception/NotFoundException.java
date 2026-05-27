package com.project.mycv.config.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class NotFoundException extends RuntimeException {
    private final HttpStatus status;

    private String type;

    private String message;

    public NotFoundException(String message) {
        super(message);
        this.status = HttpStatus.NOT_FOUND;
        this.message = message;
    }

    public NotFoundException(String type, String message) {
        super(message);
        this.status = HttpStatus.NOT_FOUND;
        this.type = type;
        this.message = message;
    }
}
