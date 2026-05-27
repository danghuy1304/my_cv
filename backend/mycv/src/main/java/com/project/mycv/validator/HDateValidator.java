package com.project.mycv.validator;

import com.project.mycv.annotation.validator.HVDate;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.Data;

import java.util.Objects;

@Data
public class HDateValidator implements ConstraintValidator<HVDate, String> {
    public static final String NOT_DATE_MESSAGE = "Not date";

    public static final String DEFAULT_DATE_PATTERN = "yyyy/MM/dd";

    private String pattern = DEFAULT_DATE_PATTERN;

    @Override
    public void initialize(HVDate annotation) {
        this.pattern = annotation.pattern();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (Objects.equals(value, null) || Objects.equals(value, "")) {
            return true;
        }

        return value.matches(pattern);
    }
}
