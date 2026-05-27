import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';

// ============================================================
// LOGIN PAGE
// ============================================================
const Login = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Xử lý thay đổi giá trị input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi của field khi người dùng bắt đầu gõ lại
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Validate form phía client
  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return newErrors;
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Kiểm tra validate trước khi gọi API
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      // useAuth.login sẽ tự navigate về /dashboard khi thành công
    } catch (error) {
      const message = error.response?.data?.message || 'Email hoặc mật khẩu không đúng';
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Đăng nhập</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <Input
          label="Mật khẩu"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        {/* Hiển thị lỗi từ server (sai email/mật khẩu) */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md px-3 py-2">
            {serverError}
          </div>
        )}

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          Đăng nhập
        </Button>
      </form>
    </>
  );
};

export default Login;
