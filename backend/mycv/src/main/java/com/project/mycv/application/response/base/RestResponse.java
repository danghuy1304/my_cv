package com.project.mycv.application.response.base;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

public class RestResponse {
    /**
     * Ok response entity.
     *
     * @param data the data
     * @return the response entity
     */
    public static ResponseEntity<?> success(Object data) {
        return success(HttpStatus.OK, data);
    }

    /**
     * Ok response entity.
     *
     * @param status the status
     * @param data   the data
     * @return the response entity
     */
    public static ResponseEntity<?> success(HttpStatus status, Object data) {
        RestData<?> restData = RestData.success(status, data);
        return ResponseEntity.status(status).body(restData);
    }

    /**
     * Success response entity.
     *
     * @param status the status
     * @param type   the type
     * @param data   the data
     * @return the response entity
     */
    public static ResponseEntity<?> success(HttpStatus status, String type, Object data) {
        RestData<?> restData = RestData.success(status, type, data);
        return ResponseEntity.status(status).body(restData);
    }

    /**
     * Success response entity.
     *
     * @param status  the status
     * @param type    the type
     * @param message the message
     * @param data    the data
     * @return the response entity
     */
    public static ResponseEntity<?> success(HttpStatus status, String type, String message, Object data) {
        RestData<?> restData = RestData.success(status, type, message, data);
        return ResponseEntity.status(status).body(restData);
    }

    /**
     * Error response entity.
     *
     * @param status  the status
     * @param type    the type
     * @param message the message
     * @return the response entity
     */
    public static ResponseEntity<?> error(HttpStatus status, String type, String message) {
        RestData<?> restData = RestData.error(status, type, message);
        return new ResponseEntity<>(restData, status);
    }

    /**
     * Error response entity.
     *
     * @param status  the status
     * @param message the message
     * @return the response entity
     */
    public static ResponseEntity<?> error(HttpStatus status, String message) {
        RestData<?> restData = RestData.error(status, message);
        return new ResponseEntity<>(restData, status);
    }

    /**
     * Errors response entity.
     *
     * @param status        the status
     * @param type          the type
     * @param errorMessages the error messages
     * @return the response entity
     */
    public static ResponseEntity<?> errors(HttpStatus status, String type, List<String> errorMessages) {
        RestData<?> restData = RestData.errors(status, type, errorMessages);
        return new ResponseEntity<>(restData, status);
    }
}
