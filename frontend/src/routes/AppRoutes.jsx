import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

// Layouts
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import Login from '@/pages/Login/Login';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Profile from '@/pages/Profile/Profile';
import CVWorkspace from '@/pages/CVWorkspace/CVWorkspace';
import AccessLogs from '@/pages/AccessLogs/AccessLogs';
import CVPreview from '@/pages/CVPreview/CVPreview';
import NotFound from '@/pages/NotFound/NotFound';
import Forbidden from '@/pages/Forbidden/Forbidden';

// ============================================================
// APP ROUTES
//
// Phân cấp bảo vệ:
//   1. PrivateRoute  — kiểm tra isAuthenticated (chưa login → /login)
//   2. RoleRoute     — kiểm tra role (sai role → /forbidden)
// ============================================================
const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* ── Public CV (no auth required) ── */}
      <Route path="/cv/:username" element={<CVPreview publicMode />} />

      {/* ── Error pages (accessible without login) ── */}
      <Route path="/not-found" element={<NotFound />} />
      <Route path="/forbidden" element={<Forbidden />} />

      {/* ── Protected: phải đăng nhập ── */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>

          {/* ── Admin only: role === 'ADMIN' ── */}
          <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route path="/dashboard"    element={<Dashboard />} />
            <Route path="/cv-workspace" element={<CVWorkspace />} />
            <Route path="/access-logs"  element={<AccessLogs />} />
            <Route path="/cv-preview"   element={<CVPreview />} />
            <Route path="/profile"      element={<Profile />} />
          </Route>

        </Route>
      </Route>

      {/* ── Redirects ── */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* ── Catch-all: route không tồn tại → /not-found ── */}
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
};

export default AppRoutes;
