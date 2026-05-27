// ============================================================
// LOCALSTORAGE UTILS - Helper thao tác với LocalStorage
// Xử lý an toàn, tránh crash khi JSON parse thất bại
// ============================================================

/**
 * Lưu dữ liệu vào LocalStorage (tự động serialize sang JSON)
 * @param {string} key   - Key lưu trữ
 * @param {any}    value - Giá trị bất kỳ (object, array, string, ...)
 */
export const setLocalStorage = (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`[LocalStorage] Lỗi khi lưu key "${key}":`, error);
  }
};

/**
 * Lấy dữ liệu từ LocalStorage (tự động parse JSON)
 * @param {string} key          - Key cần lấy
 * @param {any}    defaultValue - Giá trị mặc định nếu key không tồn tại
 * @returns {any}
 */
export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.error(`[LocalStorage] Lỗi khi đọc key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Xóa một key khỏi LocalStorage
 * @param {string} key
 */
export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`[LocalStorage] Lỗi khi xóa key "${key}":`, error);
  }
};

/**
 * Xóa toàn bộ LocalStorage
 */
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("[LocalStorage] Lỗi khi clear:", error);
  }
};
