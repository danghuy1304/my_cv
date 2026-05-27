Bạn là một Chuyên gia Kiến trúc Phần mềm và Kỹ sư trưởng hệ thống Java.

Nhiệm vụ: Quét toàn bộ Workspace/Repository Backend hiện tại và tự động sinh tài liệu kiến trúc hệ thống từ mã nguồn
thực tế.

Mục tiêu: Tạo file `PROJECT_CONTEXT.md` đóng vai trò là "Single Source of Truth" cho dự án.

QUY TẮC BẮT BUỘC:

1. Chỉ phân tích dựa trên mã nguồn thực tế trong repository hiện tại.
2. KHÔNG được suy đoán hoặc tự bịa thông tin.
3. Nếu không tìm thấy thông tin:
   → ghi "[Chưa triển khai]"
4. Với mỗi kết luận quan trọng, thêm mục:
   "Nguồn phân tích:"
    - file: đường dẫn file
    - class: tên class
    - method: tên method (nếu có)
5. Nếu có nhiều cấu hình môi trường:
   (`application.yml`,
   `application-dev.yml`,
   `application-prod.yml`,
   `.env`)
   → phân tích sự kế thừa và override.
6. Nếu repository quá lớn:
   → phân tích theo module/package rồi hợp nhất kết quả.
7. Chỉ trả về nội dung Markdown thuần trong block code.
8. Không thêm giải thích ngoài Markdown.

Tạo file theo cấu trúc sau:

# 🌐 TÀI LIỆU NGỮ CẢNH DỰ ÁN (PROJECT BACKEND)

> Tài liệu này phản ánh trạng thái kiến trúc thực tế từ mã nguồn hiện tại.

---

# 1. 🏗️ KIẾN TRÚC TỔNG QUAN

## Công nghệ sử dụng

Liệt kê chính xác:

- Java version
- Spring Boot
- Spring Security
- MyBatis/JPA
- Database
- Redis
- RabbitMQ/Kafka
- Docker
- Maven/Gradle
- Các dependency quan trọng khác

Nguồn phân tích:

- file:
- class:

## Cấu trúc package/module

Ví dụ:

controller/
service/
service/impl/
mapper/
entity/
dto/
config/
common/
security/

Mô tả trách nhiệm từng package.

## Quy ước đặt tên

Phân tích:

- Java Object ↔ Database Table
- DTO
- VO
- Request
- Response
- Mapper
- Service
- Constants

## Luồng dữ liệu hệ thống

Mô tả flow:

Client
↓
Controller
↓
Service
↓
Mapper/Repository
↓
Database

Nếu có:

- Redis
- MQ
- External API
- Async
- Event

thì mô tả luồng đầy đủ.

---

# 2. 🛡️ SPRING SECURITY & AUTHENTICATION

## Cơ chế xác thực

Phân tích:

- JWT hay Session
- Access Token
- Refresh Token
- Filter Chain

Liệt kê:

- SecurityFilterChain
- JwtFilter
- AuthenticationProvider
- PasswordEncoder
- UserDetailsService

Nguồn phân tích:

- file:
- class:

## Cơ chế phân quyền

Phân tích:

- @EnableMethodSecurity
- @PreAuthorize
- @Secured
- Role hierarchy

Liệt kê API đang được bảo vệ.

## Xử lý lỗi

Phân tích:

- AuthenticationEntryPoint
- AccessDeniedHandler
- GlobalExceptionHandler

Liệt kê:

- HTTP status
- Internal code
- JSON trả về

Ví dụ:

```json
{
  "code": "TOKEN_EXPIRED",
  "message": "Token expired"
}
```

---

# 3. 🧩 COMMON / SHARED COMPONENTS

Quét toàn bộ:

- Utils
- Helper
- Constants
- Common Service
- Converter
- Validator

Với từng component:

Tên:

Mục đích:

Cách hoạt động:

Không được viết lại nếu đã tồn tại:

Nguồn phân tích:

---

# 4. 🗄️ DATABASE & ENTITY MAPPING

Quét:

- Entity
- Mapper XML
- Repository
- Migration SQL
- Flyway/Liquibase

Cho từng bảng:

Tên bảng:

Mô tả:

| Column | Type | PK | FK | Nullable |
|--------|------|----|----|----------|

Mối quan hệ:

- OneToMany
- ManyToOne
- ManyToMany

Nguồn phân tích:

---

# 5. 🔄 CẤU HÌNH HỆ THỐNG

Phân tích:

- application.yml
- profile
- environment variables
- cache
- datasource
- scheduler
- MQ
- CORS
- upload
- external API

Nguồn phân tích:

---

# 6. 📡 TÍCH HỢP NGOÀI HỆ THỐNG

Quét:

- REST Client
- OpenFeign
- WebClient
- Graph API
- SMTP
- S3
- Redis
- RabbitMQ
- Kafka

Mô tả:

Mục đích:

Flow:

Nguồn phân tích:

---

# 7. 📝 TRẠNG THÁI HỆ THỐNG HIỆN TẠI

Ngày tạo tài liệu: [Ngày hiện tại]

Liệt kê:

- Thành phần đã triển khai
- Thành phần chưa triển khai
- Technical debt
- Điểm cần chú ý

---

# 8. 📌 UPDATE LOG

Không tự suy đoán.

Chỉ lấy từ:

- Git commit
- CHANGELOG
- Migration
- package version thay đổi

Nếu không tìm thấy:

[Không đủ dữ liệu]

| Date | Change | Evidence |
|------|--------|----------|