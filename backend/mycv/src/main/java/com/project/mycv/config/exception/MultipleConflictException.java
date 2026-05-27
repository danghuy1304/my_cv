package com.project.mycv.config.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.List;

@Getter
public class MultipleConflictException extends RuntimeException {
    private final HttpStatus status;
    private final List<String> messages;

    /**
     * Constructor with list of conflict messages.
     *
     * @param messages the list of conflict messages
     */
    public MultipleConflictException(List<String> messages) {
        super(String.join(", ", messages));
        this.status = HttpStatus.CONFLICT;
        this.messages = messages;
    }
}

