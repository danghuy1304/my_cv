# 📡 API REFERENCE — MY CV BACKEND

> **Base URL**: `http://localhost:8080`  
> **API Prefix**: `/api/v1`  
> **Date**: 2026-05-28  
> **Format**: All responses are JSON wrapped in `RestData<T>` envelope (xem [Response Envelope](#-response-envelope))

---

## 📦 Response Envelope

Mọi response thành công đều bọc trong cấu trúc sau:

```json
{
  "status": 200,
  "type": "Success",
  "data": { ... }
}
```

Khi lỗi:

```json
{
  "status": 400,
  "type": "ConflictException",
  "errors": ["Tên người dùng đã tồn tại"]
}
```

| Field    | Type            | Mô tả                                         |
|----------|-----------------|-----------------------------------------------|
| `status` | `int`           | HTTP status code                              |
| `type`   | `string`        | `"Success"` hoặc class tên Exception          |
| `data`   | `object / null` | Payload dữ liệu (chỉ có khi thành công)       |
| `errors` | `string[]`      | Danh sách lỗi (chỉ có khi thất bại)           |

---

## 🔐 Authentication

- Dùng **JWT Bearer Token** trong header: `Authorization: Bearer <accessToken>`
- `accessToken` có hiệu lực **10 phút** (mặc định)
- `refreshToken` có hiệu lực **7 ngày**, được set vào **HttpOnly Cookie** tên `refreshToken`
- Cookie `isLoggedIn=1` cũng được set khi login (không HttpOnly — FE đọc được)

### Routes bypass (KHÔNG cần JWT):

| Method | Path                           |
|--------|--------------------------------|
| POST   | `/api/v1/users/login`          |
| POST   | `/api/v1/users/register`       |
| POST   | `/api/v1/users/refresh-token`  |
| GET    | `/api/v1/cv/**`                |
| POST   | `/api/v1/cv/**`                |
| GET    | `/actuator/health`             |

---

## 🗂️ Mục lục API

1. [👤 User / Auth](#1--user--auth---apiv1users)
2. [🛡️ Admin — CV Profile](#2-%EF%B8%8F-admin--cv-profile---apiv1admincv-profiles)
3. [🌐 Public CV](#3--public-cv---apiv1cv)
4. [❌ Error Codes](#-error-codes)

---

---

# 1. 👤 User / Auth — `/api/v1/users`

---

## `POST /api/v1/users/register`

**Mục đích**: Đăng ký tài khoản mới.

**Auth**: ❌ Không cần

### Request Body

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "secret123"
}
```

| Field      | Type     | Required | Mô tả           |
|------------|----------|----------|-----------------|
| `email`    | `string` | ✅        | Email người dùng |
| `username` | `string` | ✅        | Tên đăng nhập   |
| `password` | `string` | ✅        | Mật khẩu        |

### Response — `200 OK`

```
(empty body)
```

### Lỗi có thể xảy ra

| HTTP | Type               | Mô tả                          |
|------|--------------------|--------------------------------|
| 409  | `ConflictException` | Username hoặc email đã tồn tại |
| 400  | `ValidationError`  | Thiếu field bắt buộc           |

---

## `POST /api/v1/users/login`

**Mục đích**: Đăng nhập, nhận `accessToken` + set `refreshToken` vào cookie.

**Auth**: ❌ Không cần

### Request Body

```json
{
  "username": "johndoe",
  "password": "secret123"
}
```

| Field      | Type     | Required | Mô tả         |
|------------|----------|----------|---------------|
| `username` | `string` | ✅        | Tên đăng nhập |
| `password` | `string` | ✅        | Mật khẩu      |

### Response — `200 OK`

```json
{
  "status": 200,
  "type": "Success",
  "data": {
    "username": "johndoe",
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

| Field          | Type     | Mô tả                                 |
|----------------|----------|---------------------------------------|
| `username`     | `string` | Tên đăng nhập                         |
| `accessToken`  | `string` | JWT dùng trong header `Authorization` |
| `refreshToken` | `string` | Token dùng để refresh (cũng set cookie) |

> **Note**: Đồng thời set 2 cookie:
> - `refreshToken` — giá trị refresh token (HttpOnly)
> - `isLoggedIn=1` — flag cho FE biết đã đăng nhập

### Lỗi có thể xảy ra

| HTTP | Type               | Mô tả                       |
|------|--------------------|-----------------------------|
| 401  | `AuthorizedException` | Sai username/password     |
| 404  | `UsernameNotFoundException` | User không tồn tại  |
| 400  | `ClientException`  | Tài khoản bị vô hiệu hóa   |

---

## `POST /api/v1/users/refresh-token`

**Mục đích**: Lấy `accessToken` mới khi token cũ hết hạn. Đọc `refreshToken` từ cookie.

**Auth**: ❌ Không cần (bypass)

### Cookie Required

| Cookie         | Mô tả         |
|----------------|---------------|
| `refreshToken` | Refresh token |

### Response — `200 OK`

```json
{
  "status": 200,
  "type": "Success",
  "data": {
    "accessToken": "eyJhbGciOi..."
  }
}
```

| Field         | Type     | Mô tả              |
|---------------|----------|--------------------|
| `accessToken` | `string` | JWT access token mới |

### Lỗi có thể xảy ra

| HTTP | Type                  | Mô tả                          |
|------|-----------------------|--------------------------------|
| 401  | `AuthorizedException` | Không có cookie / token hết hạn |
| 404  | `NotFoundException`   | Token không tồn tại trong DB   |

---

## `POST /api/v1/users/logout`

**Mục đích**: Đăng xuất — revoke `refreshToken` trong DB, xóa cookie.

**Auth**: ✅ JWT required

### Cookie Required

| Cookie         | Mô tả         |
|----------------|---------------|
| `refreshToken` | Refresh token |

### Response — `200 OK`

```
(empty body)
```

> **Note**: Xóa cả 2 cookie: `refreshToken` và `isLoggedIn`

---

## `GET /api/v1/users/me`

**Mục đích**: Lấy thông tin người dùng hiện tại đang đăng nhập.

**Auth**: ✅ JWT required

### Response — `200 OK`

```json
{
  "status": 200,
  "type": "Success",
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "user@example.com",
    "status": 1,
    "role": {
      "id": 1,
      "roleName": "ROLE_ADMIN",
      "description": "Administrator"
    },
    "createdDate": "2025-01-01T10:00:00",
    "updatedDate": "2025-01-01T10:00:00"
  }
}
```

| Field         | Type              | Mô tả                            |
|---------------|-------------------|----------------------------------|
| `id`          | `number`          | ID người dùng                    |
| `username`    | `string`          | Tên đăng nhập                    |
| `email`       | `string`          | Email                            |
| `status`      | `number`          | `1` = active, `0` = inactive     |
| `role`        | `object`          | Role của user                    |
| `role.roleName` | `string`        | `"ROLE_ADMIN"`, `"ROLE_USER"`... |
| `createdDate` | `string (ISO8601)` | Thời điểm tạo                   |
| `updatedDate` | `string (ISO8601)` | Thời điểm cập nhật              |

> **Note**: Field `password` bị ẩn trong response (`@JsonIgnoreProperties`)

### Lỗi có thể xảy ra

| HTTP | Type                  | Mô tả                      |
|------|-----------------------|----------------------------|
| 401  | `AuthorizedException` | Token không hợp lệ / thiếu |

---

---

# 2. 🛡️ Admin — CV Profile — `/api/v1/admin/cv-profiles`

> **Tất cả API trong nhóm này yêu cầu**: `Authorization: Bearer <accessToken>` + Role `ROLE_ADMIN`

---

## `GET /api/v1/admin/cv-profiles`

**Mục đích**: Lấy danh sách tất cả CV profiles (có phân trang).

**Auth**: ✅ JWT + `ROLE_ADMIN`

### Query Parameters

| Param  | Type      | Required | Default | Mô tả           |
|--------|-----------|----------|---------|-----------------|
| `page` | `integer` | ❌        | 1       | Số trang        |
| `size` | `integer` | ❌        | 10      | Số item mỗi trang |

### Response — `200 OK`

```json
{
  "status": 200,
  "type": "Success",
  "data": {
    "data": [
      {
        "id": 1,
        "userId": 1,
        "fullName": "Nguyen Van A",
        "title": "Backend Developer",
        "email": "a@example.com",
        "phone": "0909123456",
        "avatarUrl": "https://...",
        "status": "PUBLISHED",
        "isPublic": true,
        "viewCount": 100,
        "publishedAt": "2025-01-01T10:00:00",
        "createdDate": "2025-01-01T10:00:00",
        "updatedDate": "2025-01-01T10:00:00"
      }
    ],
    "pagination": {
      "page": 1,
      "perPage": 10,
      "lastPage": 5,
      "total": 50
    }
  }
}
```

**CvProfileDTO fields:**

| Field         | Type               | Mô tả                                         |
|---------------|--------------------|-----------------------------------------------|
| `id`          | `number`           | ID của CV profile                             |
| `userId`      | `number`           | ID người sở hữu CV                            |
| `fullName`    | `string`           | Họ tên đầy đủ                                 |
| `title`       | `string`           | Tiêu đề / chức danh                           |
| `email`       | `string`           | Email liên hệ                                 |
| `phone`       | `string`           | Số điện thoại                                 |
| `avatarUrl`   | `string`           | URL ảnh đại diện                              |
| `status`      | `string`           | `"DRAFT"` \| `"PUBLISHED"` \| `"ARCHIVED"`   |
| `isPublic`    | `boolean`          | CV có public không                            |
| `viewCount`   | `number`           | Số lượt xem                                   |
| `publishedAt` | `string (ISO8601)` | Thời điểm publish                             |
| `createdDate` | `string (ISO8601)` | Thời điểm tạo                                 |
| `updatedDate` | `string (ISO8601)` | Thời điểm cập nhật                            |

---

## `POST /api/v1/admin/cv-profiles`

**Mục đích**: Tạo CV profile mới (trạng thái mặc định là `DRAFT`).

**Auth**: ✅ JWT + `ROLE_ADMIN`

### Request Body

```json
{
  "fullName": "Nguyen Van A",
  "title": "Backend Developer"
}
```

| Field      | Type     | Required | Mô tả                       |
|------------|----------|----------|-----------------------------|
| `fullName` | `string` | ✅        | Họ tên đầy đủ (bắt buộc)    |
| `title`    | `string` | ❌        | Tiêu đề / chức danh         |

### Response — `201 Created`

```json
{
  "status": 201,
  "type": "Success",
  "data": { /* CvProfileDetailDTO — xem bên dưới */ }
}
```

> Xem cấu trúc **CvProfileDetailDTO** tại [`GET /api/v1/admin/cv-profiles/{id}`](#get-apiv1admincv-profilesid)

### Lỗi có thể xảy ra

| HTTP | Type              | Mô tả                     |
|------|-------------------|---------------------------|
| 400  | `ValidationError` | `fullName` bị bỏ trống    |

---

## `GET /api/v1/admin/cv-profiles/{id}`

**Mục đích**: Lấy thông tin đầy đủ của một CV bất kỳ theo ID.

**Auth**: ✅ JWT + `ROLE_ADMIN`

### Path Parameters

| Param | Type     | Mô tả         |
|-------|----------|---------------|
| `id`  | `number` | ID CV profile |

### Response — `200 OK`

```json
{
  "status": 200,
  "type": "Success",
  "data": {
    "id": 1,
    "userId": 1,
    "fullName": "Nguyen Van A",
    "title": "Backend Developer",
    "birthday": "1995-06-15",
    "phone": "0909123456",
    "email": "a@example.com",
    "githubUrl": "https://github.com/nguyenvana",
    "linkedinUrl": "https://linkedin.com/in/nguyenvana",
    "websiteUrl": "https://nguyenvana.dev",
    "address": "Ho Chi Minh City",
    "summaryShort": "5 năm kinh nghiệm...",
    "summaryLong": "Mô tả chi tiết...",
    "avatarUrl": "https://...",
    "status": "PUBLISHED",
    "isPublic": true,
    "viewCount": 100,
    "publishedAt": "2025-01-01T10:00:00",
    "deletedAt": null,
    "createdDate": "2025-01-01T10:00:00",
    "updatedDate": "2025-01-01T10:00:00",
    "skills": [ /* CvSkillDTO[] */ ],
    "educations": [ /* CvEducationDTO[] */ ],
    "projects": [ /* CvProjectDTO[] */ ],
    "interests": [ /* CvInterestDTO[] */ ],
    "certifications": [ /* CvCertificationDTO[] */ ]
  }
}
```

**CvProfileDetailDTO fields:**

| Field          | Type               | Mô tả                                         |
|----------------|--------------------|-----------------------------------------------|
| `id`           | `number`           | ID CV                                         |
| `userId`       | `number`           | ID user sở hữu                                |
| `fullName`     | `string`           | Họ tên                                        |
| `title`        | `string`           | Chức danh                                     |
| `birthday`     | `string (date)`    | Ngày sinh `yyyy-MM-dd`                        |
| `phone`        | `string`           | Điện thoại                                    |
| `email`        | `string`           | Email                                         |
| `githubUrl`    | `string`           | URL GitHub                                    |
| `linkedinUrl`  | `string`           | URL LinkedIn                                  |
| `websiteUrl`   | `string`           | URL website cá nhân                           |
| `address`      | `string`           | Địa chỉ                                       |
| `summaryShort` | `string`           | Mô tả ngắn                                    |
| `summaryLong`  | `string`           | Mô tả chi tiết                                |
| `avatarUrl`    | `string`           | URL ảnh đại diện                              |
| `status`       | `string`           | `"DRAFT"` \| `"PUBLISHED"` \| `"ARCHIVED"`   |
| `isPublic`     | `boolean`          | Hiển thị công khai                            |
| `viewCount`    | `number`           | Lượt xem                                      |
| `publishedAt`  | `string (ISO8601)` | Thời điểm publish                             |
| `deletedAt`    | `string (ISO8601)` | Thời điểm xóa mềm (`null` nếu chưa xóa)      |
| `createdDate`  | `string (ISO8601)` | Ngày tạo                                      |
| `updatedDate`  | `string (ISO8601)` | Ngày cập nhật                                 |
| `skills`       | `CvSkillDTO[]`     | Danh sách kỹ năng                             |
| `educations`   | `CvEducationDTO[]` | Danh sách học vấn                             |
| `projects`     | `CvProjectDTO[]`   | Danh sách dự án                               |
| `interests`    | `CvInterestDTO[]`  | Danh sách sở thích                            |
| `certifications` | `CvCertificationDTO[]` | Danh sách chứng chỉ                |

### Lỗi có thể xảy ra

| HTTP | Type                | Mô tả              |
|------|---------------------|--------------------|
| 404  | `NotFoundException` | Không tìm thấy CV  |

---

## `PUT /api/v1/admin/cv-profiles/{id}`

**Mục đích**: Cập nhật thông tin cá nhân của một CV theo ID.

**Auth**: ✅ JWT + `ROLE_ADMIN`

### Path Parameters

| Param | Type     | Mô tả         |
|-------|----------|---------------|
| `id`  | `number` | ID CV profile |

### Request Body

```json
{
  "fullName": "Nguyen Van A",
  "title": "Senior Backend Developer",
  "birthday": "1995-06-15",
  "phone": "0909123456",
  "email": "a@example.com",
  "githubUrl": "https://github.com/nguyenvana",
  "linkedinUrl": "https://linkedin.com/in/nguyenvana",
  "websiteUrl": "https://nguyenvana.dev",
  "address": "Ho Chi Minh City",
  "summaryShort": "5 năm kinh nghiệm...",
  "summaryLong": "Mô tả chi tiết hơn...",
  "avatarUrl": "https://cdn.example.com/avatar.jpg"
}
```

| Field          | Type            | Required | Mô tả                  |
|----------------|-----------------|----------|------------------------|
| `fullName`     | `string`        | ❌        | Họ tên               |
| `title`        | `string`        | ❌        | Chức danh            |
| `birthday`     | `string (date)` | ❌        | Ngày sinh `yyyy-MM-dd` |
| `phone`        | `string`        | ❌        | Điện thoại           |
| `email`        | `string`        | ❌        | Email                |
| `githubUrl`    | `string`        | ❌        | GitHub URL           |
| `linkedinUrl`  | `string`        | ❌        | LinkedIn URL         |
| `websiteUrl`   | `string`        | ❌        | Website URL          |
| `address`      | `string`        | ❌        | Địa chỉ              |
| `summaryShort` | `string`        | ❌        | Mô tả ngắn          |
| `summaryLong`  | `string`        | ❌        | Mô tả dài           |
| `avatarUrl`    | `string`        | ❌        | URL ảnh đại diện    |

### Response — `200 OK`

```
(empty body)
```

---

## `PUT /api/v1/admin/cv-profiles/{id}/status`

**Mục đích**: Cập nhật trạng thái và visibility của một CV theo ID.

**Auth**: ✅ JWT + `ROLE_ADMIN`

### Path Parameters

| Param | Type     | Mô tả         |
|-------|----------|---------------|
| `id`  | `number` | ID CV profile |

### Request Body

```json
{
  "status": "PUBLISHED",
  "isPublic": true
}
```

| Field      | Type      | Required | Mô tả                                         |
|------------|-----------|----------|-----------------------------------------------|
| `status`   | `string`  | ❌        | `"DRAFT"` \| `"PUBLISHED"` \| `"ARCHIVED"`   |
| `isPublic` | `boolean` | ❌        | `true` = công khai, `false` = ẩn              |

### Response — `200 OK`

```
(empty body)
```

---

## `DELETE /api/v1/admin/cv-profiles/{id}`

**Mục đích**: Xóa cứng (hard-delete) một CV theo ID (cascade DB).

**Auth**: ✅ JWT + `ROLE_ADMIN`

### Path Parameters

| Param | Type     | Mô tả         |
|-------|----------|---------------|
| `id`  | `number` | ID CV profile |

### Response — `204 No Content`

```
(empty body)
```

---

## `GET /api/v1/admin/cv-profiles/my-detail`

**Mục đích**: Lấy thông tin đầy đủ CV của admin đang đăng nhập.

**Auth**: ✅ JWT + `ROLE_ADMIN`

### Response — `200 OK`

> Cấu trúc giống **CvProfileDetailDTO** — xem [`GET /api/v1/admin/cv-profiles/{id}`](#get-apiv1admincv-profilesid)

---

## `PUT /api/v1/admin/cv-profiles` *(no id)*

**Mục đích**: Cập nhật thông tin cá nhân CV của admin đang đăng nhập.

**Auth**: ✅ JWT + `ROLE_ADMIN`

### Request Body

> Giống **CvProfileUpdateDTO** — xem [`PUT /api/v1/admin/cv-profiles/{id}`](#put-apiv1admincv-profilesid)

### Response — `200 OK`

```
(empty body)
```

---

## `PUT /api/v1/admin/cv-profiles/status`

**Mục đích**: Cập nhật trạng thái/visibility CV của admin đang đăng nhập.

**Auth**: ✅ JWT + `ROLE_ADMIN`

### Request Body

> Giống **CvStatusUpdateDTO** — xem [`PUT /api/v1/admin/cv-profiles/{id}/status`](#put-apiv1admincv-profilesidstatus)

### Response — `200 OK`

```
(empty body)
```

---

## `PUT /api/v1/admin/cv-profiles/skills`

**Mục đích**: Thay thế toàn bộ danh sách kỹ năng của CV (xóa hết rồi insert lại).

**Auth**: ✅ JWT + `ROLE_ADMIN`

### Request Body

```json
{
  "skills": [
    {
      "skillCategory": "Backend",
      "skillName": "Java",
      "skillLevel": "Expert",
      "displayOrder": 1
    },
    {
      "skillCategory": "Frontend",
      "skillName": "ReactJS",
      "skillLevel": "Intermediate",
      "displayOrder": 2
    }
  ]
}
```

| Field           | Type      | Required | Mô tả                                                  |
|-----------------|-----------|----------|--------------------------------------------------------|
| `skills`        | `array`   | ✅        | Danh sách kỹ năng (gửi rỗng để xóa hết)               |
| `skillCategory` | `string`  | ❌        | Nhóm kỹ năng (vd: `"Backend"`, `"Frontend"`)          |
| `skillName`     | `string`  | ❌        | Tên kỹ năng                                            |
| `skillLevel`    | `string`  | ❌        | Mức độ (vd: `"Beginner"`, `"Intermediate"`, `"Expert"`) |
| `displayOrder`  | `integer` | ❌        | Thứ tự hiển thị                                        |

### Response — `200 OK`

```
(empty body)
```

---

## `PUT /api/v1/admin/cv-profiles/educations`

**Mục đích**: Thay thế toàn bộ danh sách học vấn.

**Auth**: ✅ JWT + `ROLE_ADMIN`

### Request Body

```json
{
  "educations": [
    {
      "schoolName": "Đại học Bách Khoa TP.HCM",
      "major": "Công nghệ Thông tin",
      "degree": "Kỹ sư",
      "gpa": "3.5",
      "description": "Tốt nghiệp loại giỏi",
      "startDate": "2013-09-01",
      "endDate": "2017-06-30"
    }
  ]
}
```

| Field        | Type            | Required | Mô tả                           |
|--------------|-----------------|----------|---------------------------------|
| `educations` | `array`         | ✅        | Danh sách học vấn                |
| `schoolName` | `string`        | ❌        | Tên trường                       |
| `major`      | `string`        | ❌        | Ngành học                        |
| `degree`     | `string`        | ❌        | Bằng cấp (vd: `"Kỹ sư"`, `"Thạc sĩ"`) |
| `gpa`        | `string`        | ❌        | Điểm GPA                         |
| `description`| `string`        | ❌        | Mô tả thêm                       |
| `startDate`  | `string (date)` | ❌        | Ngày bắt đầu `yyyy-MM-dd`        |
| `endDate`    | `string (date)` | ❌        | Ngày kết thúc `yyyy-MM-dd`       |

### Response — `200 OK`

```
(empty body)
```

---

## `PUT /api/v1/admin/cv-profiles/projects`

**Mục đích**: Thay thế toàn bộ danh sách dự án (bao gồm task của từng dự án).

**Auth**: ✅ JWT + `ROLE_ADMIN`

### Request Body

```json
{
  "projects": [
    {
      "projectName": "My CV System",
      "companyName": "ABC Corp",
      "teamSize": 5,
      "roleInProject": "Backend Developer",
      "techFrontend": "ReactJS, TailwindCSS",
      "techBackend": "Java Spring Boot, PostgreSQL",
      "techDevopsTools": "Docker, GitHub Actions",
      "urlDemo": "https://mycv.example.com",
      "startDate": "2023-01-01",
      "endDate": "2023-12-31",
      "tasks": [
        { "taskDescription": "Thiết kế API RESTful cho hệ thống CV" },
        { "taskDescription": "Tích hợp JWT authentication" }
      ]
    }
  ]
}
```

| Field             | Type            | Required | Mô tả                               |
|-------------------|-----------------|----------|-------------------------------------|
| `projects`        | `array`         | ✅        | Danh sách dự án                      |
| `projectName`     | `string`        | ❌        | Tên dự án                            |
| `companyName`     | `string`        | ❌        | Tên công ty                          |
| `teamSize`        | `integer`       | ❌        | Số thành viên nhóm                   |
| `roleInProject`   | `string`        | ❌        | Vai trò trong dự án                  |
| `techFrontend`    | `string`        | ❌        | Công nghệ Frontend                   |
| `techBackend`     | `string`        | ❌        | Công nghệ Backend                    |
| `techDevopsTools` | `string`        | ❌        | Công cụ DevOps / CI-CD               |
| `urlDemo`         | `string`        | ❌        | URL demo                             |
| `startDate`       | `string (date)` | ❌        | Ngày bắt đầu `yyyy-MM-dd`            |
| `endDate`         | `string (date)` | ❌        | Ngày kết thúc `yyyy-MM-dd`           |
| `tasks`           | `array`         | ❌        | Danh sách task/nhiệm vụ trong dự án  |
| `tasks[].taskDescription` | `string` | ❌  | Mô tả công việc                      |

### Response — `200 OK`

```
(empty body)
```

---

## `PUT /api/v1/admin/cv-profiles/interests`

**Mục đích**: Thay thế toàn bộ danh sách sở thích.

**Auth**: ✅ JWT + `ROLE_ADMIN`

### Request Body

```json
{
  "interests": [
    { "interestName": "Đọc sách", "displayOrder": 1 },
    { "interestName": "Lập trình", "displayOrder": 2 }
  ]
}
```

| Field          | Type      | Required | Mô tả            |
|----------------|-----------|----------|------------------|
| `interests`    | `array`   | ✅        | Danh sách sở thích |
| `interestName` | `string`  | ❌        | Tên sở thích      |
| `displayOrder` | `integer` | ❌        | Thứ tự hiển thị   |

### Response — `200 OK`

```
(empty body)
```

---

## `PUT /api/v1/admin/cv-profiles/certifications`

**Mục đích**: Thay thế toàn bộ danh sách chứng chỉ.

**Auth**: ✅ JWT + `ROLE_ADMIN`

### Request Body

```json
{
  "certifications": [
    {
      "certName": "AWS Certified Solutions Architect",
      "issuingOrganization": "Amazon Web Services",
      "issueDate": "2023-06-01",
      "expirationDate": "2026-06-01",
      "credentialId": "ABC-12345",
      "credentialUrl": "https://aws.amazon.com/verify/ABC-12345"
    }
  ]
}
```

| Field                 | Type            | Required | Mô tả                       |
|-----------------------|-----------------|----------|-----------------------------|
| `certifications`      | `array`         | ✅        | Danh sách chứng chỉ          |
| `certName`            | `string`        | ❌        | Tên chứng chỉ                |
| `issuingOrganization` | `string`        | ❌        | Tổ chức cấp                  |
| `issueDate`           | `string (date)` | ❌        | Ngày cấp `yyyy-MM-dd`        |
| `expirationDate`      | `string (date)` | ❌        | Ngày hết hạn `yyyy-MM-dd`    |
| `credentialId`        | `string`        | ❌        | Mã chứng chỉ                 |
| `credentialUrl`       | `string`        | ❌        | URL xác thực chứng chỉ       |

### Response — `200 OK`

```
(empty body)
```

---

---

# 3. 🌐 Public CV — `/api/v1/cv`

---

## `GET /api/v1/cv/{username}`

**Mục đích**: Lấy toàn bộ thông tin CV công khai theo username. Tự động tăng `viewCount`.

**Auth**: ❌ Không cần

### Path Parameters

| Param      | Type     | Mô tả                   |
|------------|----------|-------------------------|
| `username` | `string` | Username của chủ sở hữu CV |

### Response — `200 OK`

> Cấu trúc giống **CvProfileDetailDTO** với đầy đủ `skills`, `educations`, `projects`, `interests`, `certifications`  
> Xem chi tiết tại [`GET /api/v1/admin/cv-profiles/{id}`](#get-apiv1admincv-profilesid)

### Lỗi có thể xảy ra

| HTTP | Type                | Mô tả                             |
|------|---------------------|-----------------------------------|
| 404  | `NotFoundException` | Không tìm thấy CV hoặc CV không public |

---

## `POST /api/v1/cv/{username}/log`

**Mục đích**: Ghi log lượt xem CV. FE gọi âm thầm khi visitor vào xem trang CV. Backend tự động parse IP, User-Agent, Referer từ request headers.

**Auth**: ❌ Không cần

### Path Parameters

| Param      | Type     | Mô tả                   |
|------------|----------|-------------------------|
| `username` | `string` | Username của chủ sở hữu CV |

### Request Body

```
(none — không cần body)
```

> Backend tự đọc từ HTTP Headers:
> - `X-Forwarded-For` / `REMOTE_ADDR` → IP
> - `User-Agent` → thông tin trình duyệt / thiết bị
> - `Referer` → trang nguồn

### Response — `200 OK`

```
(empty body)
```

---

---

# ❌ Error Codes

## HTTP Status Codes

| HTTP | Khi nào xảy ra                                     |
|------|----------------------------------------------------|
| 200  | Thành công                                         |
| 201  | Tạo mới thành công                                 |
| 204  | Xóa thành công (không có body)                     |
| 400  | Dữ liệu đầu vào không hợp lệ                       |
| 401  | Token thiếu / hết hạn / không hợp lệ               |
| 403  | Không có quyền truy cập                            |
| 404  | Không tìm thấy resource                            |
| 409  | Conflict (username/email đã tồn tại, v.v.)         |
| 500  | Lỗi server nội bộ                                  |

## Error Response Format

```json
{
  "status": 401,
  "type": "AuthorizedException",
  "errors": ["Xác thực thất bại"]
}
```

## Exception Types

| Type                         | HTTP | Mô tả                                   |
|------------------------------|------|------------------------------------------|
| `AuthorizedException`        | 401  | JWT không hợp lệ / thiếu token          |
| `AccessDeniedException`      | 403  | Không có role phù hợp                   |
| `NotFoundException`          | 404  | Resource không tồn tại                  |
| `UsernameNotFoundException`  | 404  | User không tồn tại                      |
| `ConflictException`          | 409  | Vi phạm unique constraint               |
| `MultipleConflictException`  | 409  | Nhiều conflict cùng lúc (trả về mảng)   |
| `ClientException`            | 400  | Lỗi nghiệp vụ từ phía client            |
| `ValidationError`            | 400  | Dữ liệu không pass validation (`@Valid`) |
| `RuntimeException`           | 500  | Lỗi server không xác định               |

---

---

# 📋 API Summary Table

| Method | Path                                          | Auth            | Mô tả                              |
|--------|-----------------------------------------------|-----------------|------------------------------------|
| POST   | `/api/v1/users/register`                      | ❌ Public       | Đăng ký tài khoản                  |
| POST   | `/api/v1/users/login`                         | ❌ Public       | Đăng nhập                          |
| POST   | `/api/v1/users/refresh-token`                 | ❌ Cookie only  | Lấy access token mới               |
| POST   | `/api/v1/users/logout`                        | ✅ JWT          | Đăng xuất                          |
| GET    | `/api/v1/users/me`                            | ✅ JWT          | Thông tin user hiện tại            |
| GET    | `/api/v1/admin/cv-profiles`                   | ✅ ADMIN        | Danh sách tất cả CV (phân trang)   |
| POST   | `/api/v1/admin/cv-profiles`                   | ✅ ADMIN        | Tạo CV mới                         |
| GET    | `/api/v1/admin/cv-profiles/my-detail`         | ✅ ADMIN        | CV chi tiết của admin hiện tại     |
| PUT    | `/api/v1/admin/cv-profiles`                   | ✅ ADMIN        | Cập nhật thông tin CV của mình     |
| PUT    | `/api/v1/admin/cv-profiles/status`            | ✅ ADMIN        | Cập nhật status/visibility của mình |
| PUT    | `/api/v1/admin/cv-profiles/skills`            | ✅ ADMIN        | Thay thế toàn bộ kỹ năng           |
| PUT    | `/api/v1/admin/cv-profiles/educations`        | ✅ ADMIN        | Thay thế toàn bộ học vấn           |
| PUT    | `/api/v1/admin/cv-profiles/projects`          | ✅ ADMIN        | Thay thế toàn bộ dự án             |
| PUT    | `/api/v1/admin/cv-profiles/interests`         | ✅ ADMIN        | Thay thế toàn bộ sở thích          |
| PUT    | `/api/v1/admin/cv-profiles/certifications`    | ✅ ADMIN        | Thay thế toàn bộ chứng chỉ         |
| GET    | `/api/v1/admin/cv-profiles/{id}`              | ✅ ADMIN        | CV chi tiết theo ID                |
| PUT    | `/api/v1/admin/cv-profiles/{id}`              | ✅ ADMIN        | Cập nhật thông tin CV theo ID      |
| PUT    | `/api/v1/admin/cv-profiles/{id}/status`       | ✅ ADMIN        | Cập nhật status CV theo ID         |
| DELETE | `/api/v1/admin/cv-profiles/{id}`              | ✅ ADMIN        | Xóa CV theo ID                     |
| GET    | `/api/v1/cv/{username}`                       | ❌ Public       | Lấy CV công khai theo username     |
| POST   | `/api/v1/cv/{username}/log`                   | ❌ Public       | Ghi log lượt xem CV                |

