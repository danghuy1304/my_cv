import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import cvProfileReducer from "./slices/cvProfileSlice";
import languageReducer from "./slices/languageSlice";
import { setStore } from "./storeAccessor";

// ============================================================
// CẤU HÌNH REDUX STORE
// ============================================================
const store = configureStore({
  reducer: {
    auth: authReducer, // Trạng thái xác thực (token, isAuthenticated)
    profile: profileReducer, // Thông tin tài khoản user (/users/me)
    cvProfile: cvProfileReducer, // Toàn bộ CV data (/admin/cv-profiles/*)
    language: languageReducer, // Ngôn ngữ hiển thị (vi / en)
  },
});

// Đăng ký store vào accessor để apiClient.js dùng (tránh circular dependency)
setStore(store);

export default store;
