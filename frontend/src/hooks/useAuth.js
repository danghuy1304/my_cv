import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectCurrentUser,
  loginSuccess,
  logoutSuccess,
} from "@/store/slices/authSlice";
import { clearProfile } from "@/store/slices/profileSlice";
import { login as loginAPI, logout as logoutAPI } from "@/services/authService";

// ============================================================
// useAuth HOOK
// Custom hook tập trung toàn bộ logic xác thực
// Dùng thay vì gọi dispatch trực tiếp trong component
//
// @example
// const { user, isAuthenticated, login, logout } = useAuth();
// ============================================================
const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  /**
   * Đăng nhập: gọi API, lưu token, cập nhật Redux store
   * @param {string} username  — tên đăng nhập (KHÔNG phải email)
   * @param {string} password
   */
  const login = async (username, password) => {
    // loginAPI đã unwrap response.data.data → { username, accessToken, refreshToken }
    const data = await loginAPI(username, password);
    dispatch(loginSuccess(data));
    navigate("/dashboard", { replace: true });
    return data;
  };

  /**
   * Đăng xuất: gọi API, xóa token, reset toàn bộ state
   */
  const logout = async () => {
    try {
      // Gọi API logout để invalidate token + xóa cookie refreshToken trên server
      await logoutAPI();
    } catch {
      // Bỏ qua lỗi API khi logout (vẫn xóa state phía client)
    } finally {
      dispatch(logoutSuccess()); // Xóa auth state (accessToken chỉ trong RAM)
      dispatch(clearProfile()); // Xóa profile data
      navigate("/login", { replace: true });
    }
  };

  return { user, isAuthenticated, login, logout };
};

export default useAuth;
