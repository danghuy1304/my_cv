package com.project.mycv.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInsertDTO {
    private String username;
    private String password;
    private String email;
    private Long roleId;
}
