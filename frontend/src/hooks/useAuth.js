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
   * @param {string} email
   * @param {string} password
   */
  const login = async (email, password) => {
    const response = await loginAPI(email, password);
    const { accessToken, refreshToken, user: userData } = response.data;

    // Cập nhật Redux store (authSlice sẽ tự lưu token vào LocalStorage)
    dispatch(loginSuccess({ accessToken, refreshToken, user: userData }));

    // Chuyển hướng về dashboard sau khi login thành công
    navigate("/dashboard", { replace: true });

    return response.data;
  };

  /**
   * Đăng xuất: gọi API, xóa token, reset toàn bộ state
   */
  const logout = async () => {
    try {
      // Gọi API logout để invalidate token trên server
      await logoutAPI();
    } catch {
      // Bỏ qua lỗi API khi logout (vẫn xóa state phía client)
    } finally {
      dispatch(logoutSuccess()); // Xóa auth state & token khỏi LocalStorage
      dispatch(clearProfile()); // Xóa profile data
      navigate("/login", { replace: true });
    }
  };

  return { user, isAuthenticated, login, logout };
};

export default useAuth;
