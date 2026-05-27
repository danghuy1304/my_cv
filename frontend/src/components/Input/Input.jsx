import { forwardRef } from 'react';

// ============================================================
// INPUT COMPONENT - Ô nhập liệu dùng chung toàn dự án
//
// Props:
//   - label       : Nhãn hiển thị trên ô input
//   - name        : Thuộc tính name (dùng cho form)
//   - type        : "text" | "email" | "password" | "number" | ...
//   - placeholder : Placeholder text
//   - value       : Giá trị hiện tại (controlled component)
//   - onChange    : Hàm xử lý khi thay đổi giá trị
//   - error       : Thông báo lỗi validation
//   - disabled    : Vô hiệu hóa ô input
//   - required    : Đánh dấu trường bắt buộc
//   - className   : Class bổ sung
//
// Dùng forwardRef để component cha có thể truy cập DOM element
// (cần thiết khi dùng với react-hook-form)
// ============================================================
const Input = forwardRef(({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
  ...rest
}, ref) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {/* Label - chỉ hiển thị nếu có truyền vào */}
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {/* Dấu * đỏ cho trường bắt buộc */}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input field */}
      <input
        ref={ref}
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={[
          'w-full px-3 py-2 rounded-md border text-sm transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          // Style khi có lỗi
          error
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 bg-white',
          // Style khi disabled
          disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : '',
          className,
        ].join(' ')}
        {...rest}
      />

      {/* Thông báo lỗi validation */}
      {error && (
        <span className="text-xs text-red-500 mt-0.5">{error}</span>
      )}
    </div>
  );
});

// Đặt displayName cho dễ debug trên React DevTools
Input.displayName = 'Input';

export default Input;
