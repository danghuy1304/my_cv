package com.project.mycv.constant.type;

import lombok.Getter;

@Getter
public enum HTypeCvStatus {
    DRAFT("DRAFT"),
    PUBLISHED("PUBLISHED"),
    ARCHIVED("ARCHIVED");

    private final String value;

    HTypeCvStatus(String value) {
        this.value = value;
    }
}

