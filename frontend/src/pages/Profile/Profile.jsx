import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProfile,
  saveProfile,
  selectProfile,
  selectProfileLoading,
  selectProfileError,
} from '@/store/slices/profileSlice';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import Loading from '@/components/Loading/Loading';

// ============================================================
// PROFILE PAGE - Xem và chỉnh sửa thông tin cá nhân
// ============================================================
const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const isLoading = useSelector(selectProfileLoading);
  const error = useSelector(selectProfileError);

  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch profile khi component mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Đồng bộ form data khi profile data thay đổi
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMsg(''); // Xóa thông báo thành công khi user chỉnh sửa
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');

    try {
      // Dispatch async thunk để lưu profile
      await dispatch(saveProfile(formData)).unwrap();
      setSuccessMsg('Cập nhật thành công!');
    } catch {
      // Lỗi đã được lưu vào Redux state (selectProfileError)
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Thông tin cá nhân</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Họ và tên"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled // Email thường không cho chỉnh sửa
          />
          <Input
            label="Số điện thoại"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0901234567"
          />

          {/* Thông báo lỗi từ server */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md px-3 py-2">
              {error}
            </div>
          )}

          {/* Thông báo lưu thành công */}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-md px-3 py-2">
              {successMsg}
            </div>
          )}

          <div className="flex justify-end mt-2">
            <Button type="submit" isLoading={isSaving}>
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
