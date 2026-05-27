package com.project.mycv.domain.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.project.mycv.domain.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true, value = {"password"})
public class UserDTO {
    private Long id;
    private String username;
    private String password;
    private String email;
    private int status;
    private Role role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
