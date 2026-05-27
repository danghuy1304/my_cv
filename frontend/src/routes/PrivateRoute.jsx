import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

// ============================================================
// PRIVATE ROUTE - Bảo vệ các trang yêu cầu đăng nhập
//
// Cách dùng trong AppRoutes:
//   <Route element={<PrivateRoute />}>
//     <Route path="/dashboard" element={<Dashboard />} />
//     <Route path="/profile" element={<Profile />} />
//   </Route>
// ============================================================
const PrivateRoute = ({ redirectTo = '/login' }) => {
  // Lấy trạng thái đăng nhập từ Redux store
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Nếu đã đăng nhập: render các route con (Outlet)
  // Nếu chưa đăng nhập: chuyển hướng về trang login
  // "replace" để không lưu vào history (tránh back về trang bị chặn)
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default PrivateRoute;
