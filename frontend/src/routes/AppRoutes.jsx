import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import Login from '@/pages/Login/Login';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Profile from '@/pages/Profile/Profile';

// ============================================================
// APP ROUTES - Cấu hình toàn bộ định tuyến của ứng dụng
// ============================================================
const AppRoutes = () => {
  return (
    <Routes>
      {/* ===== ROUTES CÔNG KHAI (không cần đăng nhập) ===== */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* ===== ROUTES BẢO VỆ (phải đăng nhập mới vào được) ===== */}
      {/* PrivateRoute sẽ kiểm tra token, nếu chưa login sẽ redirect /login */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Chuyển hướng mặc định từ "/" về "/dashboard" */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Trang 404 - bắt các route không tồn tại */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
