package com.project.mycv.helper;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Simple User-Agent and HTTP header parser.
 * Uses regex/string matching — no external library required.
 */
public final class UserAgentParser {

    private UserAgentParser() {
    }

    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Extract the real client IP address, respecting reverse-proxy headers.
     */
    public static String extractIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (isBlankOrUnknown(ip)) ip = request.getHeader("X-Real-IP");
        if (isBlankOrUnknown(ip)) ip = request.getHeader("Proxy-Client-IP");
        if (isBlankOrUnknown(ip)) ip = request.getRemoteAddr();
        // X-Forwarded-For may contain a comma-separated list — take the first (original client)
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return (ip != null && !ip.isBlank()) ? ip : "unknown";
    }

    /**
     * Detect the browser name from a User-Agent string.
     * Returns "Unknown" when the header is absent or unrecognised.
     */
    public static String detectBrowser(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) return "Unknown";
        // Order matters: Edge must be checked before Chrome
        if (userAgent.contains("Edg/") || userAgent.contains("EdgA/")) return "Edge";
        if (userAgent.contains("Chrome/") && !userAgent.contains("Chromium")) return "Chrome";
        if (userAgent.contains("Firefox/")) return "Firefox";
        if (userAgent.contains("Safari/") && !userAgent.contains("Chrome")) return "Safari";
        if (userAgent.contains("MSIE") || userAgent.contains("Trident/")) return "Internet Explorer";
        if (userAgent.contains("Opera") || userAgent.contains("OPR/")) return "Opera";
        return "Unknown";
    }

    /**
     * Detect the operating system from a User-Agent string.
     * Returns "Unknown" when the header is absent or unrecognised.
     */
    public static String detectOS(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) return "Unknown";
        // Android must be checked before Linux (Android UA contains "Linux")
        if (userAgent.contains("Android")) return "Android";
        if (userAgent.contains("iPhone") || userAgent.contains("iPad") || userAgent.contains("iPod")) return "iOS";
        if (userAgent.contains("Windows")) return "Windows";
        if (userAgent.contains("Mac OS X") || userAgent.contains("Macintosh")) return "MacOS";
        if (userAgent.contains("Linux")) return "Linux";
        return "Unknown";
    }

    /**
     * Detect the device type from a User-Agent string.
     * Priority: Bot → Tablet → Mobile → Desktop.
     */
    public static String detectDeviceType(String userAgent) {
        if (userAgent == null || userAgent.isBlank()) return "Unknown";
        String ua = userAgent.toLowerCase();
        if (ua.contains("bot") || ua.contains("crawler") || ua.contains("spider")
                || ua.contains("slurp") || ua.contains("googlebot")) return "Bot";
        // Tablet: iPad explicitly, or Android without "mobile" keyword
        if (ua.contains("ipad") || (ua.contains("android") && !ua.contains("mobile"))) return "Tablet";
        if (ua.contains("mobile") || ua.contains("iphone") || ua.contains("ipod")
                || ua.contains("windows phone")) return "Mobile";
        return "Desktop";
    }

    // ─────────────────────────────────────────────────────────────────────────

    private static boolean isBlankOrUnknown(String value) {
        return value == null || value.isBlank() || "unknown".equalsIgnoreCase(value);
    }
}

