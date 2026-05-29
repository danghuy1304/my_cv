import { createSlice } from "@reduxjs/toolkit";
import { getRoleFromToken } from "@/utils/jwt";

// ============================================================
// AUTH SLICE - Quản lý trạng thái xác thực của người dùng
// accessToken lưu trong RAM (Redux state) — KHÔNG lưu localStorage
// refreshToken lưu trong HttpOnly cookie do backend set
// ============================================================

const initialState = {
  token: null, // accessToken — chỉ tồn tại trong RAM
  user: null, // { username } — thông tin cơ bản
  isAuthenticated: false,
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
      // API /users/login trả về { username, accessToken, refreshToken }
      // refreshToken được backend set vào HttpOnly cookie — không cần lưu ở đây
      const { accessToken, username } = action.payload;

      state.token = accessToken;
      state.user = {
        username,
        // Decode JWT để lấy role cho phân quyền FE (chỉ dùng cho routing/UI)
        role: getRoleFromToken(accessToken),
      };
      state.isAuthenticated = true;
    },

    /**
     * Cập nhật accessToken sau khi refresh thành công
     * Cũng cập nhật role từ token mới (phòng trường hợp role thay đổi)
     */
    tokenRefreshed: (state, action) => {
      state.token = action.payload;
      const newRole = getRoleFromToken(action.payload);
      if (state.user) {
        state.user.role = newRole ?? state.user.role;
      }
    },

    /**
     * Xóa toàn bộ thông tin xác thực khi logout
     */
    logoutSuccess: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, tokenRefreshed, logoutSuccess } =
  authSlice.actions;

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentRole = (state) => state.auth.user?.role ?? null;
export const selectAuthToken = (state) => state.auth.token;

export default authSlice.reducer;
