import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import useT from '@/hooks/useT';

// ============================================================
// LOGIN PAGE
// ============================================================
const Login = () => {
  const { login } = useAuth();
  const t = useT();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Xử lý thay đổi giá trị input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Validate form phía client
  const validate = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = t.login.usernameRequired;
    } else if (formData.username.length < 3) {
      newErrors.username = t.login.usernameMinLength;
    }
    if (!formData.password) {
      newErrors.password = t.login.passwordRequired;
    } else if (formData.password.length < 6) {
      newErrors.password = t.login.passwordMinLength;
    }
    return newErrors;
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.username, formData.password);
    } catch (error) {
      const message = error.response?.data?.errors?.[0] || t.login.defaultError;
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t.login.title}</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label={t.login.username}
          name="username"
          type="text"
          placeholder={t.login.usernamePlaceholder}
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          required
        />

        <Input
          label={t.login.password}
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

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
          {t.login.submit}
        </Button>
      </form>
    </>
  );
};

export default Login;
