// ============================================================
// FORMATTERS - Các hàm định dạng dữ liệu dùng chung toàn dự án
// ============================================================

/**
 * Định dạng ngày tháng theo chuẩn Việt Nam
 *
 * @param {string | Date | number} dateInput - Ngày cần định dạng
 * @param {object} options - Tùy chọn bổ sung cho Intl.DateTimeFormat
 * @returns {string} - Ngày đã định dạng (vd: "25/05/2026")
 *
 * @example
 * formatDate('2026-05-25')         // "25/05/2026"
 * formatDate(new Date())            // "25/05/2026"
 * formatDate('2026-05-25', { includeTime: true }) // "25/05/2026, 14:30"
 */
export const formatDate = (dateInput, options = {}) => {
  if (!dateInput) return "—"; // Trả về dấu gạch ngang nếu không có giá trị

  try {
    const date = new Date(dateInput);

    // Kiểm tra date hợp lệ
    if (isNaN(date.getTime())) return "—";

    const { includeTime = false, locale = "vi-VN" } = options;

    const formatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
    };

    return new Intl.DateTimeFormat(locale, formatOptions).format(date);
  } catch {
    return "—";
  }
};

/**
 * Định dạng số tiền theo chuẩn Việt Nam (VNĐ)
 *
 * @param {number | string} amount - Số tiền cần định dạng
 * @param {object} options - Tùy chọn bổ sung
 * @returns {string} - Số tiền đã định dạng (vd: "1.500.000 ₫")
 *
 * @example
 * formatCurrency(1500000)                        // "1.500.000 ₫"
 * formatCurrency(1500000, { currency: 'USD' })   // "US$1,500,000.00"
 * formatCurrency(1500000, { showSymbol: false }) // "1.500.000"
 */
export const formatCurrency = (amount, options = {}) => {
  if (amount === null || amount === undefined || amount === "") return "—";

  try {
    const { currency = "VND", locale = "vi-VN", showSymbol = true } = options;

    const numericAmount =
      typeof amount === "string"
        ? parseFloat(amount.replace(/[^0-9.-]/g, "")) // Loại bỏ ký tự không phải số
        : amount;

    if (isNaN(numericAmount)) return "—";

    if (showSymbol) {
      // Định dạng có ký hiệu tiền tệ
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        // VNĐ không có số thập phân
        minimumFractionDigits: currency === "VND" ? 0 : 2,
        maximumFractionDigits: currency === "VND" ? 0 : 2,
      }).format(numericAmount);
    }

    // Chỉ định dạng số, không có ký hiệu
    return new Intl.NumberFormat(locale).format(numericAmount);
  } catch {
    return "—";
  }
};

/**
 * Rút gọn số lớn thành dạng K, M, B
 *
 * @example
 * formatCompactNumber(1500)     // "1,5K"
 * formatCompactNumber(1500000)  // "1,5M"
 */
export const formatCompactNumber = (number, locale = "vi-VN") => {
  if (number === null || number === undefined) return "—";

  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
  }).format(number);
};
