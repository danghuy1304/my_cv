package com.project.mycv.utility;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class CookieUtility {
    private static final Logger LOGGER = LoggerFactory.getLogger(CookieUtility.class);

    @Value("${cookie.domain}")
    private String COOKIE_DOMAIN;
    @Value("${app.client.url}")
    private String URL_CLIENT;

    public Cookie setCookie(String key, String value, int maxAge) {
        LOGGER.info("Set cookie: {}, value: {}, maxAge: {}", key, value, maxAge);
        boolean isLocalhost = URL_CLIENT.contains("localhost");
        Cookie cookie = new Cookie(key, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(!isLocalhost);
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        cookie.setDomain(isLocalhost ? null : COOKIE_DOMAIN);
        return cookie;
    }

    public Cookie setCookieWithoutHttpOnly(String key, String value, int maxAge) {
        LOGGER.info("Set cookie without HttpOnly: {}, value: {}, maxAge: {}", key, value, maxAge);
        boolean isLocalhost = URL_CLIENT.contains("localhost");
        Cookie cookie = new Cookie(key, value);
        cookie.setHttpOnly(false);
        cookie.setSecure(!isLocalhost);
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        cookie.setDomain(isLocalhost ? null : COOKIE_DOMAIN);
        return cookie;
    }

    public Cookie getCookie(HttpServletRequest request, String key) {
        if (request.getCookies() == null) {
            return null;
        }
        for (Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals(key)) {
                return cookie;
            }
        }
        return null;
    }

    public void deleteCookie(HttpServletResponse response, String key) {
        boolean isLocalhost = URL_CLIENT.contains("localhost");
        Cookie cookie = new Cookie(key, "");
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setDomain(isLocalhost ? null : COOKIE_DOMAIN);
        response.addCookie(cookie);
    }
}
