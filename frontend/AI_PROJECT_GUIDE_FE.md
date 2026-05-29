# AI Project Guide - Frontend (my_cv)
> Tài liệu kỹ thuật chi tiết để AI hoặc dev mới nắm nhanh toàn bộ frontend.
> **Cập nhật lần cuối:** Phase 3 — Admin Dashboard hoàn chỉnh

---

## 1. Stack công nghệ

| Layer | Technology |
|-------|-----------|
| Core | React 19 + Vite 8 (JavaScript ES Modules) |
| Routing | react-router-dom 7 |
| State | Redux Toolkit 2 + react-redux 9 |
| HTTP | Axios 1 (custom instance với interceptors) |
| Styling | Tailwind CSS v4 via @tailwindcss/vite (không cần tailwind.config.js) |
| Animation | framer-motion |
| Charts | recharts |
| Icons | lucide-react |
| Forms | react-hook-form + @hookform/resolvers + zod |
| Table | @tanstack/react-table |
| DnD | @dnd-kit/core + @dnd-kit/sortable + @dnd-kit/utilities |
| Date | dayjs |
| Toast | sonner |

**Scripts:**
```
npm run dev      # local dev server
npm run build    # production build
npm run preview  # test build
npm run lint     # ESLint
```

---

## 2. Cấu trúc thư mục (src/)

```
src/
├── components/
│   ├── Button/Button.jsx
│   ├── Input/Input.jsx
│   └── Loading/Loading.jsx
├── hooks/
│   ├── useAuth.js
│   └── useDebounce.js
├── layouts/
│   ├── AuthLayout.jsx      # gradient bg + centered card
│   └── MainLayout.jsx      # sidebar slate-900 + top header
├── pages/
│   ├── Login/Login.jsx
│   ├── Dashboard/Dashboard.jsx     # recharts overview
│   ├── Profile/Profile.jsx         # user account info (read-only)
│   ├── CVWorkspace/
│   │   ├── CVWorkspace.jsx         # tab manager + status controls
│   │   └── tabs/
│   │       ├── GeneralInfoTab.jsx  # react-hook-form + zod
│   │       ├── SkillsTab.jsx       # @dnd-kit sortable
│   │       ├── ProjectsTab.jsx     # nested tasks array
│   │       ├── EducationsTab.jsx   # timeline dynamic form
│   │       ├── CertificationsTab.jsx
│   │       └── InterestsTab.jsx    # tag-based input
│   ├── AccessLogs/AccessLogs.jsx   # @tanstack/react-table + framer drawer
│   └── CVPreview/CVPreview.jsx     # desktop/tablet/mobile preview
├── routes/
│   ├── AppRoutes.jsx
│   └── PrivateRoute.jsx
├── services/
│   ├── apiClient.js          # Axios instance, interceptors
│   ├── authService.js        # /users/login, /users/logout, ...
│   ├── profileService.js     # /users/me
│   └── cvProfileService.js   # /admin/cv-profiles/*, /cv/*
├── store/
│   ├── index.js              # combineReducers: auth, profile, cvProfile
│   └── slices/
│       ├── authSlice.js
│       ├── profileSlice.js
│       └── cvProfileSlice.js
├── utils/
│   ├── formatters.js
│   └── localStorage.js
├── App.jsx
├── index.css          # @import 'tailwindcss'
└── main.jsx           # Provider + BrowserRouter + Toaster
```

---

## 3. Vite alias

```js
// vite.config.js
resolve: { alias: { "@": "/src" } }
```
Dùng: `import X from '@/components/X'`

---

## 4. API contract — QUAN TRỌNG

### 4.1 Base URL
- **Đúng:** `http://localhost:8080/api/v1` (cấu hình trong `.env`: `VITE_API_BASE_URL=http://localhost:8080/api/v1`)

### 4.2 Response envelope — RestData<T>
```json
// Success
{ "status": 200, "type": "success", "data": T }

// Error
{ "status": 400, "type": "error", "errors": ["message 1", ...] }
```

**Quy tắc bắt buộc:** Service layer PHẢI unwrap:
```js
// Đúng ✅
export const login = (username, password) =>
  apiClient.post('/users/login', { username, password }).then(r => r.data.data);

// Sai ❌ (trả về full AxiosResponse)
export const login = (u, p) => apiClient.post('/users/login', { u, p });
```

**Lỗi từ thunk:**
```js
error.response?.data?.errors?.[0] || 'Default message'
```

### 4.3 Xác thực
- Login trả về `{ username, accessToken, refreshToken }`
- `accessToken` → lưu localStorage + `Authorization: Bearer <token>` header
- `refreshToken` → lưu localStorage (CŨNG có thể là HttpOnly cookie từ backend)
- Response interceptor: 401 → clear tokens + redirect `/login`

---

## 5. Routing

```
/ → /dashboard (redirect)
/login → Login (AuthLayout, public)

Protected (PrivateRoute + MainLayout):
/dashboard    → Dashboard
/cv-workspace → CVWorkspace
/access-logs  → AccessLogs
/cv-preview   → CVPreview
/profile      → Profile
```

**PrivateRoute:** đọc `selectIsAuthenticated` từ Redux.

---

## 6. State Management

### 6.1 auth slice (`state.auth`)
```js
state = { token, user: { username }, isAuthenticated }

loginSuccess({ accessToken, refreshToken, username })
  → lưu token vào localStorage

logoutSuccess()
  → xóa token, reset state
```
**Selectors:** `selectIsAuthenticated`, `selectCurrentUser`, `selectAuthToken`

### 6.2 profile slice (`state.profile`)
Lưu thông tin **tài khoản** user từ `GET /users/me`:
```js
state = { data: { id, username, email, status, role, createdDate, updatedDate }, isLoading, error }
```
**Thunk:** `fetchProfile()` → gọi `getMyUserInfo()` (đã unwrap)
**Selectors:** `selectProfile`, `selectProfileLoading`, `selectProfileError`

### 6.3 cvProfile slice (`state.cvProfile`) — MỚI
Lưu toàn bộ **CV data** từ `GET /admin/cv-profiles/my-detail`:
```js
state = {
  myDetail,    // CvProfileDetailDTO (fullName, skills, projects, ...)
  publicCV,    // public CV (CVPreview)
  isLoading,
  isSaving,
  savingSection, // "skills" | "projects" | ...
  lastSaved,   // ISO timestamp
  error,
}
```
**Thunks (tất cả đã unwrap):**
- `fetchMyCVDetail()` → GET /admin/cv-profiles/my-detail
- `saveCVGeneralInfo(data)` → PUT /admin/cv-profiles
- `saveCVStatus(data)` → PUT /admin/cv-profiles/status
- `saveSkills(skills[])` → PUT /admin/cv-profiles/skills
- `saveEducations(educations[])` → PUT /admin/cv-profiles/educations
- `saveProjects(projects[])` → PUT /admin/cv-profiles/projects
- `saveInterests(interests[])` → PUT /admin/cv-profiles/interests
- `saveCertifications(certifications[])` → PUT /admin/cv-profiles/certifications
- `fetchPublicCV(username)` → GET /cv/{username}

**Selectors:** `selectMyCVDetail`, `selectPublicCV`, `selectCVLoading`, `selectCVSaving`, `selectCVSavingSection`, `selectCVLastSaved`, `selectCVError`

---

## 7. Services

### authService.js
```js
login(username, password)      → POST /users/login         → { username, accessToken, refreshToken }
register(userData)             → POST /users/register
logout()                       → POST /users/logout
refreshAccessToken()           → POST /users/refresh-token  → { accessToken }
getMe()                        → GET  /users/me             → { id, username, email, status, role, ... }
```

### profileService.js
```js
getMyUserInfo()  → GET /users/me  → { id, username, email, status, role }
```

### cvProfileService.js
```js
getMyCVDetail()                  → GET  /admin/cv-profiles/my-detail
updateMyCVProfile(data)          → PUT  /admin/cv-profiles
updateMyCVStatus(data)           → PUT  /admin/cv-profiles/status
updateCVSkills(skills)           → PUT  /admin/cv-profiles/skills       { skills: [...] }
updateCVEducations(educations)   → PUT  /admin/cv-profiles/educations   { educations: [...] }
updateCVProjects(projects)       → PUT  /admin/cv-profiles/projects     { projects: [...] }
updateCVInterests(interests)     → PUT  /admin/cv-profiles/interests    { interests: [...] }
updateCVCertifications(certs)    → PUT  /admin/cv-profiles/certifications
getPublicCV(username)            → GET  /cv/{username}
logCVView(username)              → POST /cv/{username}/log
```

**Chiến lược CV sections: Replace-All** — mỗi PUT gửi toàn bộ array.

---

## 8. Trang chính

### Dashboard
- Fetch `fetchMyCVDetail()` khi mount
- 4 StatCard: lượt xem, trạng thái CV, số kỹ năng, ngày xuất bản
- recharts AreaChart: trend 7 ngày (dữ liệu estimate)
- recharts PieChart: device breakdown (demo)
- Quick action links

### CV Workspace
- Tabs: Thông tin chung | Kỹ năng | Dự án | Học vấn | Chứng chỉ | Sở thích
- Topbar: status dropdown + last saved timestamp
- GeneralInfoTab: react-hook-form + zod validation
- SkillsTab: @dnd-kit sortable list, inline edit
- ProjectsTab: accordion cards, nested tasks
- EducationsTab, CertificationsTab: dynamic cards
- InterestsTab: tag-style input

### Access Logs
- @tanstack/react-table (sort, filter, pagination)
- framer-motion detail drawer khi click row
- **Dữ liệu demo** — API `GET /admin/access-logs` chưa có backend

### CV Preview
- Fetch `fetchPublicCV(username)` từ public endpoint
- Toggle Desktop/Tablet/Mobile viewport (maxWidth animation)
- Render đầy đủ các sections CV

### Profile
- Hiển thị user account info **read-only**: username, email, role, status, ngày tạo
- Không có form chỉnh sửa (API không hỗ trợ PUT /users/me)

---

## 9. Common Components

### Button.jsx
```jsx
<Button variant="primary|secondary|danger|ghost" size="sm|md|lg" isLoading disabled onClick>
```

### Input.jsx
```jsx
<Input label name type value onChange error disabled required /> // forwardRef
```

### Loading.jsx
```jsx
<Loading size="sm|md|lg" color="blue|white|inherit" fullScreen />
```

---

## 10. Layout

### MainLayout
- Sidebar `bg-slate-900` (240px, sticky, collapsible trên mobile)
- Mobile: hamburger → framer-motion slide drawer
- Nav items: Dashboard, CV Workspace, Access Logs, CV Preview, Tài khoản
- Bottom: user avatar + username + logout button
- Top header: 56px, user avatar

### AuthLayout
- Gradient background, centered card, Outlet

---

## 11. Design System

- **Primary:** blue-600
- **Sidebar:** slate-900
- **Cards:** `bg-white rounded-2xl border border-gray-100 shadow-sm`
- **Spacing:** `p-6`, `gap-6`
- **Animations:** framer-motion (`initial={{ opacity:0, y:-8 }}`, page transitions)
- **Toast:** sonner `<Toaster richColors position="top-right" />`

---

## 12. Lưu ý quan trọng

1. **Không bao giờ gọi axios trong component** — dùng service → thunk → selector
2. **Luôn unwrap response**: `.then(r => r.data.data)` trong service
3. **Error message**: `error.response?.data?.errors?.[0]`
4. **Login field**: `username` (KHÔNG phải `email`)
5. **Tailwind v4**: `@import 'tailwindcss'` trong `index.css`, không cần config file
6. **Access Logs API**: chưa có backend, dùng DEMO_LOGS placeholder
