import Loading from '@/components/Loading/Loading';

// ============================================================
// BUTTON COMPONENT - Nút bấm dùng chung toàn dự án
//
// Props:
//   - children    : Nội dung hiển thị trên nút
//   - type        : "button" | "submit" | "reset" (default: "button")
//   - variant     : "primary" | "secondary" | "danger" | "ghost"
//   - size        : "sm" | "md" | "lg" (default: "md")
//   - isLoading   : Hiển thị spinner khi đang xử lý
//   - disabled    : Vô hiệu hóa nút
//   - onClick     : Hàm xử lý khi click
//   - className   : Class bổ sung từ bên ngoài (override style)
// ============================================================

// Map variant → Tailwind classes tương ứng
const VARIANT_STYLES = {
  primary:   'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
  danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  ghost:     'bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-300',
};

const SIZE_STYLES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  ...rest
}) => {
  // Nút bị disable khi đang loading HOẶC khi prop disabled = true
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={[
        // Base styles
        'inline-flex items-center justify-center gap-2',
        'rounded-md font-medium transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        // Variant & size
        VARIANT_STYLES[variant] || VARIANT_STYLES.primary,
        SIZE_STYLES[size] || SIZE_STYLES.md,
        // Disabled state
        isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
        // Class bổ sung từ bên ngoài
        className,
      ].join(' ')}
      {...rest}
    >
      {/* Hiển thị spinner khi đang loading */}
      {isLoading && <Loading size="sm" color="inherit" />}
      {children}
    </button>
  );
};

export default Button;
