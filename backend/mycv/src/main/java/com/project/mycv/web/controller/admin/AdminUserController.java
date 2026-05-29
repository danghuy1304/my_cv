package com.project.mycv.web.controller.admin;

import com.project.mycv.application.mapper.UserMapper;
import com.project.mycv.application.response.base.RestResponse;
import org.springframework.http.HttpStatus;
import com.project.mycv.utility.PaginationUtility;
import com.project.mycv.web.base.RestAPI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestAPI("/api/v1/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserMapper userMapper;

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        return RestResponse.success(PaginationUtility.paginate(userMapper::findAll, page, size));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body) {
        Integer status = body.get("status");
        if (status == null) {
            return RestResponse.error(org.springframework.http.HttpStatus.BAD_REQUEST, "VALIDATION", "status is required");
        }
        userMapper.updateStatus(id, status);
        return RestResponse.success(null);
    }
}