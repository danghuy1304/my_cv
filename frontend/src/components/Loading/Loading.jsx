// ============================================================
// LOADING COMPONENT - Spinner hiển thị trạng thái đang tải
//
// Props:
//   - size      : "sm" | "md" | "lg" (default: "md")
//   - color     : "blue" | "white" | "inherit" (default: "blue")
//   - fullScreen: Hiển thị toàn màn hình với overlay (default: false)
// ============================================================

const SIZE_MAP = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-4',
  lg: 'w-12 h-12 border-4',
};

const COLOR_MAP = {
  blue:    'border-blue-600 border-t-transparent',
  white:   'border-white border-t-transparent',
  inherit: 'border-current border-t-transparent',
};

const Loading = ({
  size = 'md',
  color = 'blue',
  fullScreen = false,
}) => {
  const spinner = (
    <div
      className={[
        'rounded-full animate-spin',
        SIZE_MAP[size] || SIZE_MAP.md,
        COLOR_MAP[color] || COLOR_MAP.blue,
      ].join(' ')}
      role="status"
      aria-label="Đang tải..."
    />
  );

  // Chế độ fullscreen: hiển thị overlay che toàn bộ màn hình
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          {/* Spinner lớn hơn khi fullscreen */}
          <div
            className={[
              'rounded-full animate-spin',
              SIZE_MAP.lg,
              COLOR_MAP.blue,
            ].join(' ')}
            role="status"
            aria-label="Đang tải..."
          />
          <p className="text-sm text-gray-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  return spinner;
};

export default Loading;
