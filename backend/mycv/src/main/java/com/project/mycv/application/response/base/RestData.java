package com.project.mycv.application.response.base;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.List;

@Getter
public class RestData<Data> {
    private final int status;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String type;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<String> errors;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Data data;

    // ── Success constructors ──────────────────────────────────────────────────

    public RestData(HttpStatus status, String type, Data data) {
        this.status = status.value();
        this.type = type;
        this.data = data;
    }

    public RestData(HttpStatus status, String type, String message, Data data) {
        this.status = status.value();
        this.type = type;
        this.errors = List.of(message);
        this.data = data;
    }

    // ── Error constructors ────────────────────────────────────────────────────

    /**
     * Single error — auto-wrapped into list
     */
    public RestData(HttpStatus status, String type, String message) {
        this.status = status.value();
        this.type = type;
        this.errors = List.of(message);
    }

    /**
     * Multiple errors
     */
    public RestData(HttpStatus status, String type, List<String> errors) {
        this.status = status.value();
        this.type = type;
        this.errors = errors;
    }

    // ── Static factory methods ────────────────────────────────────────────────

    public static RestData<?> success(HttpStatus status, Object data) {
        return new RestData<>(status, "Success", data);
    }

    public static RestData<?> success(HttpStatus status, String type, Object data) {
        return new RestData<>(status, type, data);
    }

    public static RestData<?> success(HttpStatus status, String type, String message, Object data) {
        return new RestData<>(status, type, message, data);
    }

    /**
     * Single error
     */
    public static RestData<?> error(HttpStatus status, String type, String message) {
        return new RestData<>(status, type, message);
    }

    /**
     * Single error without type
     */
    public static RestData<?> error(HttpStatus status, String message) {
        return new RestData<>(status, null, message);
    }

    /**
     * Multiple errors
     */
    public static RestData<?> errors(HttpStatus status, String type, List<String> errors) {
        return new RestData<>(status, type, errors);
    }
}
