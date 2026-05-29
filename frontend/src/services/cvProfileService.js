import apiClient from "./apiClient";

// ============================================================
// CV PROFILE SERVICE — endpoint: /api/v1/admin/cv-profiles/*
//                       public: /api/v1/cv/*
// Tất cả service đều unwrap response.data.data theo RestData envelope
// ============================================================

// --- MY CV (owner) ---

/** Lấy full CV của user đang login — GET /admin/cv-profiles/my-detail */
export const getMyCVDetail = () =>
  apiClient.get("/admin/cv-profiles/my-detail").then((r) => r.data.data);

/** Tạo CV mới — POST /admin/cv-profiles */
export const createCVProfile = (data) =>
  apiClient.post("/admin/cv-profiles", data).then((r) => r.data.data);

/** Cập nhật thông tin chung CV — PUT /admin/cv-profiles */
export const updateMyCVProfile = (data) =>
  apiClient.put("/admin/cv-profiles", data).then((r) => r.data.data);

/** Cập nhật trạng thái & visibility — PUT /admin/cv-profiles/status */
export const updateMyCVStatus = (data) =>
  apiClient.put("/admin/cv-profiles/status", data).then((r) => r.data.data);

// --- SECTIONS (replace-all strategy: gửi toàn bộ array) ---

/** Ghi đè toàn bộ skills — PUT /admin/cv-profiles/skills */
export const updateCVSkills = (skills) =>
  apiClient.put("/admin/cv-profiles/skills", { skills });

/** Ghi đè toàn bộ educations — PUT /admin/cv-profiles/educations */
export const updateCVEducations = (educations) =>
  apiClient.put("/admin/cv-profiles/educations", { educations });

/** Ghi đè toàn bộ projects — PUT /admin/cv-profiles/projects
 *  Mỗi project có trường tasks: [{ taskDescription }]
 */
export const updateCVProjects = (projects) =>
  apiClient.put("/admin/cv-profiles/projects", { projects });

/** Ghi đè toàn bộ interests — PUT /admin/cv-profiles/interests */
export const updateCVInterests = (interests) =>
  apiClient.put("/admin/cv-profiles/interests", { interests });

/** Ghi đè toàn bộ certifications — PUT /admin/cv-profiles/certifications */
export const updateCVCertifications = (certifications) =>
  apiClient.put("/admin/cv-profiles/certifications", { certifications });

/** Ghi đè toàn bộ activities — PUT /admin/cv-profiles/activities */
export const updateCVActivities = (activities) =>
  apiClient.put("/admin/cv-profiles/activities", { activities });

/** Upload/thay avatar — POST /admin/cv-profiles/avatar */
export const uploadCVAvatar = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient
    .post("/admin/cv-profiles/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data.data);
};

/** Lấy access logs — GET /admin/cv-profiles/access-logs */
export const getMyCVAccessLogs = (limit = 50) =>
  apiClient
    .get("/admin/cv-profiles/access-logs", { params: { limit } })
    .then((r) => r.data.data);

/** Lấy thống kê CV — GET /admin/cv-profiles/stats */
export const getMyCVStats = () =>
  apiClient.get("/admin/cv-profiles/stats").then((r) => r.data.data);

// --- PUBLIC CV ---

/** Xem CV công khai theo username — GET /cv/{username} */
export const getPublicCV = (username) =>
  apiClient.get(`/cv/${username}`).then((r) => r.data.data);

/** Log lượt xem CV — POST /cv/{username}/log */
export const logCVView = (username) => apiClient.post(`/cv/${username}/log`);
