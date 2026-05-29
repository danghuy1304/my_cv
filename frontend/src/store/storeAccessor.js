// ============================================================
// STORE ACCESSOR — Giải quyết circular dependency
//
// apiClient.js cần truy cập Redux store để:
//   - Đọc accessToken từ state (request interceptor)
//   - Dispatch tokenRefreshed / logoutSuccess (response interceptor)
//
// Không import store trực tiếp vì sẽ tạo vòng tròn:
//   apiClient → store → profileSlice → profileService → apiClient
//
// Giải pháp: store/index.js gọi setStore() SAU KHI tạo store,
// apiClient dùng getStore() lazily bên trong các hàm interceptor.
// ============================================================

let _store = null;

export const setStore = (store) => {
  _store = store;
};

export const getStore = () => _store;
