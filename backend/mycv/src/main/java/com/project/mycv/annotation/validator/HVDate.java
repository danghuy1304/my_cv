package com.project.mycv.annotation.validator;

import com.project.mycv.validator.HDateValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD})
@Constraint(validatedBy = HDateValidator.class)
public @interface HVDate {
    String message() default HDateValidator.NOT_DATE_MESSAGE;

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    String pattern() default HDateValidator.DEFAULT_DATE_PATTERN;
}
