import apiClient from "./apiClient";

// ============================================================
// AUTH SERVICE — endpoint: /api/v1/users/*
// Service layer unwrap response.data.data theo RestData<T> envelope
// ============================================================

/**
 * Đăng nhập — POST /api/v1/users/login
 * @param {string} username  — field tên đăng nhập (KHÔNG phải email)
 * @param {string} password
 * @returns {{ username, accessToken, refreshToken }}
 */
export const login = (username, password) =>
  apiClient
    .post("/users/login", { username, password })
    .then((r) => r.data.data);

/**
 * Đăng ký — POST /api/v1/users/register
 * @param {{ email, username, password }} userData
 */
export const register = (userData) =>
  apiClient.post("/users/register", userData);

/**
 * Đăng xuất — POST /api/v1/users/logout (cần Bearer token + cookie refreshToken)
 * Backend revoke token + xóa cookie
 */
export const logout = () => apiClient.post("/users/logout");

/**
 * Refresh access token — POST /api/v1/users/refresh-token
 * Backend đọc refreshToken từ HttpOnly cookie, không cần gửi body
 * @returns {{ accessToken }}
 */
export const refreshAccessToken = () =>
  apiClient.post("/users/refresh-token").then((r) => r.data.data);

/**
 * Lấy thông tin user đang đăng nhập — GET /api/v1/users/me
 * @returns {{ id, username, email, status, role, createdDate, updatedDate }}
 */
export const getMe = () => apiClient.get("/users/me").then((r) => r.data.data);

/**
 * Đổi mật khẩu — PUT /api/v1/users/change-password
 * @param {string} currentPassword
 * @param {string} newPassword
 */
export const changePassword = (currentPassword, newPassword) =>
  apiClient.put("/users/change-password", { currentPassword, newPassword });
