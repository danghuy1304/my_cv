package com.project.mycv.config.security.password;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Component
public class CustomPasswordEncoder implements PasswordEncoder {
    private static final String HMAC_ALGORITHM = "HmacSHA256";

    private final PasswordEncoder delegate;
    private final String salt;

    public CustomPasswordEncoder(PasswordEncoder delegate,
                                 @Value("${app.security.password.salt}") String salt) {
        this.delegate = delegate;
        this.salt = salt;
    }

    @Override
    public String encode(CharSequence rawPassword) {
        String preprocess = preprocess(rawPassword != null ? rawPassword.toString() : null);
        return delegate.encode(preprocess);
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        String preprocess = preprocess(rawPassword != null ? rawPassword.toString() : null);
        return delegate.matches(preprocess, encodedPassword);
    }

    /**
     * Applies HMAC-SHA256 with the server salt to the raw password.
     * Returns a Base64-encoded string that is then fed into BCrypt.
     */
    private String preprocess(String password) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            SecretKeySpec keySpec = new SecretKeySpec(salt.getBytes(), HMAC_ALGORITHM);
            mac.init(keySpec);
            byte[] hmacBytes = mac.doFinal(password.getBytes());
            return Base64.getEncoder().encodeToString(hmacBytes);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to apply salt to password", e);
        }
    }
}
