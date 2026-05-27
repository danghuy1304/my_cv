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
    private String message;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<String> messages;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Data data;

    /**
     * Instantiates a new Rest data.
     *
     * @param status  the status
     * @param type    the user message
     * @param message the dev message
     * @param data    the data
     */
    public RestData(HttpStatus status, String type, String message, Data data) {
        this.status = status.value();
        this.type = type;
        this.message = message;
        this.data = data;
    }

    /**
     * Instantiates a new Rest data.
     *
     * @param status  the status
     * @param type    the type
     * @param message the message
     */
    public RestData(HttpStatus status, String type, String message) {
        this.status = status.value();
        this.type = type;
        this.message = message;
    }

    /**
     * Instantiates a new Rest data.
     *
     * @param status  the status
     * @param message the message
     * @param data    the data
     */
    public RestData(HttpStatus status, String message, Data data) {
        this.status = status.value();
        this.message = message;
        this.data = data;
    }

    /**
     * Instantiates a new Rest data.
     *
     * @param status   the status
     * @param type     the type
     * @param messages the messages
     */
    public RestData(HttpStatus status, String type, List<String> messages) {
        this.status = status.value();
        this.type = type;
        this.messages = messages;
    }

    /**
     * Instantiates a new Rest data.
     *
     * @param status  the status
     * @param message the message
     */
    public RestData(HttpStatus status, String message) {
        this.status = status.value();
        this.message = message;
    }

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
     * Error rest data.
     *
     * @param status  the status
     * @param type    the type
     * @param message the message
     * @return the rest data
     */
    public static RestData<?> error(HttpStatus status, String type, String message) {
        return new RestData<>(status, type, message);
    }

    /**
     * Error rest data.
     *
     * @param status     the status
     * @param devMessage the dev message
     * @return the rest data
     */
    public static RestData<?> error(HttpStatus status, String devMessage) {
        return new RestData<>(status, devMessage);
    }

    /**
     * Errors rest data.
     *
     * @param status   the status
     * @param type     the type
     * @param messages the  messages
     * @return the rest data
     */
    public static RestData<?> errors(HttpStatus status, String type, List<String> messages) {
        return new RestData<>(status, type, messages);
    }
}
