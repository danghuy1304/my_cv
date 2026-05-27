import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, selectProfile, selectProfileLoading } from '@/store/slices/profileSlice';
import { selectCurrentUser } from '@/store/slices/authSlice';
import Loading from '@/components/Loading/Loading';

// ============================================================
// DASHBOARD PAGE
// ============================================================
const Dashboard = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const isLoading = useSelector(selectProfileLoading);
  const user = useSelector(selectCurrentUser);

  // Fetch profile khi component mount lần đầu (nếu chưa có data)
  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile());
    }
  }, [dispatch, profile]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Thẻ chào mừng */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700">
          Xin chào, <span className="text-blue-600">{profile?.fullName || user?.email || 'bạn'}</span>! 👋
        </h2>
        <p className="text-gray-500 mt-1 text-sm">
          Hôm nay là ngày {new Date().toLocaleDateString('vi-VN')}. Hãy tiếp tục xây dựng CV của bạn.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
