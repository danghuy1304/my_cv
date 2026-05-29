import apiClient from "./apiClient";

// ============================================================
// PROFILE SERVICE — User account info: /api/v1/users/*
// Lưu ý: đây là thông tin TÀI KHOẢN (username, email, role)
//          KHÔNG phải CV data (fullName, phone...) — xem cvProfileService
// ============================================================

/**
 * Lấy thông tin tài khoản user đang đăng nhập — GET /api/v1/users/me
 * @returns {{ id, username, email, status, role, createdDate, updatedDate }}
 */
export const getMyUserInfo = () =>
  apiClient.get("/users/me").then((r) => r.data.data);
