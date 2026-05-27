import apiClient from "./apiClient";

// ============================================================
// PROFILE SERVICE - Các API liên quan đến thông tin người dùng
// ============================================================

/**
 * Lấy thông tin profile của user hiện tại (dựa vào token)
 */
export const getMyProfile = () => {
  return apiClient.get("/profile/me");
};

/**
 * Cập nhật thông tin profile
 * @param {object} profileData - Dữ liệu cần cập nhật
 */
export const updateProfile = (profileData) => {
  return apiClient.put("/profile/me", profileData);
};

/**
 * Upload ảnh đại diện
 * @param {FormData} formData - FormData chứa file ảnh
 */
export const uploadAvatar = (formData) => {
  return apiClient.post("/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
