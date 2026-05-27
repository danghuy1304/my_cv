import { useState, useEffect, useRef } from "react";

// ============================================================
// useDebounce HOOK
// Trì hoãn cập nhật giá trị cho đến khi người dùng ngừng gõ
// Rất hữu ích cho ô search để giảm số lần gọi API
//
// @param {any}    value - Giá trị cần debounce (thường là search term)
// @param {number} delay - Thời gian trì hoãn (ms), mặc định 500ms
// @returns {any}        - Giá trị đã được debounce
//
// @example
// const debouncedSearch = useDebounce(searchTerm, 500);
// useEffect(() => { callSearchAPI(debouncedSearch); }, [debouncedSearch]);
// ============================================================
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Đặt timer: sau "delay" ms mới cập nhật debouncedValue
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: hủy timer cũ nếu value thay đổi trước khi timer kết thúc
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
