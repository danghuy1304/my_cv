import { Outlet } from 'react-router-dom';

// ============================================================
// AUTH LAYOUT - Layout cho các trang xác thực (Login, Register)
// Layout đơn giản: căn giữa form trên màn hình
// ============================================================
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">MyCV</h1>
          <p className="text-gray-500 mt-1">Xây dựng CV chuyên nghiệp</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Outlet render Login/Register page */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
