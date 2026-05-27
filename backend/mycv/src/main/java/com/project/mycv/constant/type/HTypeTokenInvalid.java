package com.project.mycv.constant.type;

import lombok.Getter;

@Getter
public enum HTypeTokenInvalid {
    ACCESS_TOKEN_INVALID("ACCESS_TOKEN_INVALID"),
    REFRESH_TOKEN_INVALID("REFRESH_TOKEN_INVALID");

    HTypeTokenInvalid(String value) {
        this.value = value;
    }

    final String value;
}
