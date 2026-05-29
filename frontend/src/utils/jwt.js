// ============================================================
// JWT UTILITY — Decode token payload phía FE
//
// CHÚ Ý BẢO MẬT:
//   - Chỉ decode để đọc claims (role, exp, sub...) cho routing/UI
//   - KHÔNG dùng để xác thực — luôn verify signature ở phía server
//   - Token đã bị tamper vẫn decode được nhưng server sẽ reject
// ============================================================

/**
 * Decode JWT payload (không verify signature)
 * @param {string} token
 * @returns {object|null} — payload object hoặc null nếu token không hợp lệ
 */
export const decodeToken = (token) => {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Base64url → Base64 → UTF-8 string → JSON
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    // Pad để atob không lỗi khi length không chia hết cho 4
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

/**
 * Lấy role từ JWT token
 * Hỗ trợ claim "role" (string) hoặc "roles" (array) — tùy backend
 * @param {string} token
 * @returns {string|null}
 */
export const getRoleFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  if (typeof decoded.role === "string") return decoded.role;
  if (Array.isArray(decoded.roles) && decoded.roles.length > 0)
    return decoded.roles[0];
  return null;
};

/**
 * Kiểm tra token đã hết hạn chưa (dựa vào claim "exp")
 * @param {string} token
 * @returns {boolean}
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  return Date.now() >= decoded.exp * 1000;
};
