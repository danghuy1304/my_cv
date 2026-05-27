import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";

// ============================================================
// CẤU HÌNH REDUX STORE
// Kết hợp tất cả các slice reducer lại thành một store duy nhất
// ============================================================
const store = configureStore({
  reducer: {
    auth: authReducer, // Quản lý trạng thái xác thực
    profile: profileReducer, // Quản lý thông tin profile người dùng
    // Thêm các reducer mới vào đây khi dự án mở rộng
  },

  // Redux DevTools Extension tự động hoạt động trong development mode
  // Không cần cấu hình thêm
});

export default store;
