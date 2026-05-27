import { createSlice } from "@reduxjs/toolkit";

// ============================================================
// AUTH SLICE - Quản lý trạng thái xác thực của người dùng
// ============================================================

const initialState = {
  // Khôi phục token từ LocalStorage khi app khởi động lại
  token: localStorage.getItem("accessToken") || null,
  user: null, // Thông tin cơ bản của user (email, role, ...)
  isAuthenticated: !!localStorage.getItem("accessToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Lưu thông tin sau khi đăng nhập thành công
     * Gọi action này sau khi API /auth/login trả về token
     */
    loginSuccess: (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;

      state.token = accessToken;
      state.user = user;
      state.isAuthenticated = true;

      // Lưu token vào LocalStorage để dùng cho request interceptor
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    },

    /**
     * Xóa toàn bộ thông tin xác thực khi logout
     */
    logoutSuccess: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      // Xóa token khỏi LocalStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;

export default authSlice.reducer;
