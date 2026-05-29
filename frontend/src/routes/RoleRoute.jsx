import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  selectIsAuthenticated,
  selectCurrentRole,
} from '@/store/slices/authSlice';

// ============================================================
// ROLE ROUTE — Phân quyền theo role
//
// Cách dùng trong AppRoutes:
//   <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
//     <Route path="/dashboard" element={<Dashboard />} />
//   </Route>
//
// Logic:
//   - Chưa đăng nhập              → /login
//   - Đã đăng nhập, role đúng     → render Outlet
//   - Đã đăng nhập, role không đúng → /forbidden
// ============================================================
const RoleRoute = ({ allowedRoles = [] }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectCurrentRole);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
