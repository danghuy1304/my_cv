import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AppRoutes from '@/routes/AppRoutes';
import { loginSuccess } from '@/store/slices/authSlice';
import { refreshAccessToken } from '@/services/authService';
import { decodeToken } from '@/utils/jwt';
import Loading from '@/components/Loading/Loading';

// ============================================================
// APP - Component gốc của ứng dụng
// Khởi tạo auth state khi reload: nếu cookie isLoggedIn=1 còn tồn tại
// thì tự động gọi refresh-token để lấy accessToken mới thay vì
// bắt user phải đăng nhập lại.
// ============================================================

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

function App() {
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      if (getCookie('isLoggedIn') === '1') {
        try {
          const { accessToken } = await refreshAccessToken();
          const payload = decodeToken(accessToken);
          dispatch(loginSuccess({
            accessToken,
            username: payload?.sub ?? '',
          }));
        } catch {
          // refreshToken hết hạn / bị revoke → để isAuthenticated = false
          // PrivateRoute sẽ tự redirect về /login
        }
      }
      setAuthReady(true);
    };
    initAuth();
  }, [dispatch]);

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loading size="lg" />
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;
