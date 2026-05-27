import { Outlet, Link, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

// ============================================================
// MAIN LAYOUT - Layout chính cho các trang sau khi đăng nhập
// Bao gồm Header/Navbar + nội dung trang (Outlet)
// ============================================================
const MainLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ===== NAVBAR ===== */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo / Brand */}
          <Link to="/dashboard" className="text-xl font-bold text-blue-600">
            MyCV
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">
              Hồ sơ
            </Link>
          </nav>

          {/* User info & Logout */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 hidden sm:block">
              Xin chào, <strong>{user?.fullName || user?.email || 'User'}</strong>
            </span>
            <button
              onClick={logout}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* ===== NỘI DUNG TRANG ===== */}
      {/* Outlet render component của route con tương ứng */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} MyCV. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout;
