import axios from "axios";

// ============================================================
// TẠO AXIOS INSTANCE VỚI CẤU HÌNH BASE
// ============================================================
const apiClient = axios.create({
  // Lấy baseURL từ biến môi trường Vite (.env file)
  // Fallback về localhost nếu chưa cấu hình
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  timeout: 15000, // Timeout 15 giây
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// REQUEST INTERCEPTOR
// Tự động đính kèm JWT Token vào mỗi request trước khi gửi đi
// ============================================================
apiClient.interceptors.request.use(
  (config) => {
    // Lấy token từ LocalStorage (được lưu khi user đăng nhập thành công)
    const token = localStorage.getItem("accessToken");

    if (token) {
      // Gắn token vào header theo chuẩn Bearer Authentication
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Xử lý lỗi xảy ra TRƯỚC KHI gửi request (ví dụ: network error)
    return Promise.reject(error);
  },
);

// ============================================================
// RESPONSE INTERCEPTOR
// Bắt tập trung lỗi từ server, xử lý các trường hợp đặc biệt
// ============================================================
apiClient.interceptors.response.use(
  // Trường hợp response thành công (status 2xx): trả về data trực tiếp
  (response) => response,

  // Trường hợp response thất bại (status 4xx, 5xx)
  (error) => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        // --- Lỗi 401: Token hết hạn hoặc không hợp lệ ---
        case 401:
          // Xóa sạch thông tin xác thực đã lưu trong LocalStorage
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          // Chuyển hướng người dùng về trang Login
          // Dùng window.location để tránh circular dependency với React Router
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          break;

        // --- Lỗi 403: Không có quyền truy cập ---
        case 403:
          console.error(
            "[API] Forbidden: Bạn không có quyền thực hiện hành động này.",
          );
          break;

        // --- Lỗi 404: Không tìm thấy tài nguyên ---
        case 404:
          console.error("[API] Not Found:", response.config?.url);
          break;

        // --- Lỗi 500+: Lỗi phía server ---
        default:
          if (response.status >= 500) {
            console.error(
              "[API] Server Error:",
              response.status,
              response.data?.message,
            );
          }
          break;
      }
    } else {
      // Không có response → mất kết nối mạng
      console.error("[API] Network Error: Không thể kết nối đến server.");
    }

    // Vẫn reject để các component có thể tự xử lý lỗi cụ thể nếu cần
    return Promise.reject(error);
  },
);

export default apiClient;
