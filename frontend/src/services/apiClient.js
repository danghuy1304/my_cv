import axios from "axios";
import { getStore } from "@/store/storeAccessor";
import { tokenRefreshed, logoutSuccess } from "@/store/slices/authSlice";
import { clearProfile } from "@/store/slices/profileSlice";
import { clearCVProfile } from "@/store/slices/cvProfileSlice";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

// ============================================================
// AXIOS INSTANCE CHÍNH — dùng cho toàn bộ API call
// withCredentials=true để browser tự động gửi HttpOnly cookie
// (refreshToken được backend set vào cookie khi login)
// ============================================================
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ============================================================
// AXIOS INSTANCE RIÊNG CHO REFRESH TOKEN
// Tách riêng để tránh interceptor gọi lại chính nó (infinite loop)
// ============================================================
const refreshClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ============================================================
// REFRESH QUEUE — ngăn gọi refresh nhiều lần song song
// Nếu đang refresh, các request 401 khác sẽ xếp hàng chờ token mới
// ============================================================
let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

// Helper: logout toàn bộ Redux state
const dispatchLogout = () => {
  const store = getStore();
  if (store) {
    store.dispatch(logoutSuccess());
    store.dispatch(clearProfile());
    store.dispatch(clearCVProfile());
  }
};

// ============================================================
// REQUEST INTERCEPTOR
// Đọc accessToken từ Redux state (RAM) — không dùng localStorage
// ============================================================
apiClient.interceptors.request.use(
  (config) => {
    const state = getStore()?.getState();
    const token = state?.auth?.token;
    const lang = state?.language?.lang || "vi";
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.headers["Accept-Language"] = lang;
    return config;
  },
  (error) => Promise.reject(error),
);

// ============================================================
// RESPONSE INTERCEPTOR
// Xử lý 401 theo type từ backend RestData envelope:
//   ACCESS_TOKEN_INVALID  → gọi refresh, retry request gốc
//   REFRESH_TOKEN_INVALID → logout + redirect /login
// ============================================================
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const { response, config } = error;

    // Không có response → mất kết nối mạng
    if (!response) {
      console.error("[API] Network Error: Không thể kết nối đến server.");
      return Promise.reject(error);
    }

    const { status, data } = response;
    const type = data?.type;

    // ---- 401 Unauthorized ----
    if (status === 401) {
      // refreshToken hết hạn/bị thu hồi → logout ngay
      if (type === "REFRESH_TOKEN_INVALID") {
        dispatchLogout();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      // accessToken hết hạn (hoặc thiếu) → thử refresh (chỉ 1 lần, tránh retry loop)
      // Không check type vì filter-level exceptions có thể không trả về đúng type
      if (!config._isRetry) {
        // Đang có request khác đang refresh → xếp hàng chờ token mới
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            pendingQueue.push({ resolve, reject });
          }).then((newToken) => {
            config.headers["Authorization"] = `Bearer ${newToken}`;
            return apiClient(config);
          });
        }

        config._isRetry = true;
        isRefreshing = true;

        try {
          // Backend đọc refreshToken từ HttpOnly cookie — không cần gửi body
          const res = await refreshClient.post("/users/refresh-token");
          const newToken = res.data.data.accessToken;

          // Cập nhật token vào Redux state (RAM)
          getStore()?.dispatch(tokenRefreshed(newToken));

          // Giải phóng các request đang xếp hàng
          processQueue(null, newToken);

          // Retry request gốc với token mới
          config.headers["Authorization"] = `Bearer ${newToken}`;
          return apiClient(config);
        } catch (refreshError) {
          // Refresh thất bại → logout
          processQueue(refreshError, null);
          dispatchLogout();
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    // ---- Các lỗi khác ----
    if (status === 403) {
      console.error(
        "[API] Forbidden: Bạn không có quyền thực hiện hành động này.",
      );
    } else if (status === 404) {
      console.error("[API] Not Found:", config?.url);
    } else if (status >= 500) {
      console.error("[API] Server Error:", status, data?.message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
