import apiClient from "./apiClient";

// ============================================================
// AUTH SERVICE - Các API liên quan đến xác thực người dùng
// ============================================================

/**
 * Đăng nhập bằng email và mật khẩu
 * @param {string} email
 * @param {string} password
 * @returns {Promise} - { accessToken, refreshToken, user }
 */
export const login = (email, password) => {
  return apiClient.post("/auth/login", { email, password });
};

/**
 * Đăng ký tài khoản mới
 * @param {object} userData - { email, password, fullName, ... }
 */
export const register = (userData) => {
  return apiClient.post("/auth/register", userData);
};

/**
 * Đăng xuất - gọi API để invalidate token trên server
 */
export const logout = () => {
  return apiClient.post("/auth/logout");
};

/**
 * Làm mới access token bằng refresh token
 */
export const refreshToken = (refreshToken) => {
  return apiClient.post("/auth/refresh-token", { refreshToken });
};
