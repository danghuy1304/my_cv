# 🌐 TÀI LIỆU NGỮ CẢNH DỰ ÁN (PROJECT BACKEND)

> Tài liệu này phản ánh trạng thái kiến trúc thực tế từ mã nguồn hiện tại.
> Ngày tạo: 2026-05-28

---

# 1. 🏗️ KIẾN TRÚC TỔNG QUAN

## Công nghệ sử dụng

| Công nghệ | Phiên bản | Ghi chú |
|-----------|-----------|---------|
| Java | 21 | LTS |
| Spring Boot | 4.0.6 | Parent POM |
| Spring Security | (theo Spring Boot 4.0.6) | JWT stateless |
| Spring Validation | (theo Spring Boot) | Bean Validation |
| MyBatis | 4.0.1 (mybatis-spring-boot-starter) | ORM chính |
| PageHelper | 2.1.0 (pagehelper-spring-boot-starter) | Phân trang |
| PostgreSQL | (theo runtime) | Database chính |
| JJWT | 0.12.6 | Tạo/xác thực JWT |
| ULID Creator | 5.2.3 (com.github.f4b6a3) | Sinh refresh token dạng ULID String |
| Lombok | (theo Spring Boot) | Code generation |
| Maven | — | Build tool |
| Redis | [Chưa triển khai] | — |
| RabbitMQ/Kafka | [Chưa triển khai] | — |
| Docker | [Không tìm thấy Dockerfile] | — |

**Nguồn phân tích:**
- file: `pom.xml`

---

## Cấu trúc package/module

```
com.project.mycv/
├── MycvApplication.java               → Entry point, @SpringBootApplication, @ConfigurationPropertiesScan
│
├── annotation/
│   └── validator/
│       └── HVDate.java                → Custom annotation validate định dạng ngày tháng
│
├── application/
│   ├── mapper/
│   │   ├── base/
│   │   │   ├── CrudMapper<E,T>        → Interface base: insert, update, delete
│   │   │   └── ReadableMapper<E,T>    → Interface base: findAll, findById
│   │   ├── RoleMapper                 → MyBatis mapper cho bảng roles
│   │   ├── TokenMapper                → MyBatis mapper cho bảng tokens
│   │   └── UserMapper                 → MyBatis mapper cho bảng users
│   │
│   ├── response/
│   │   ├── base/
│   │   │   ├── RestData<T>            → Wrapper response chung (status, type, errors[], data)
│   │   │   └── RestResponse           → Static factory tạo RestData
│   │   └── UserLoginResponse          → Response login (username, accessToken, refreshToken)
│   │
│   └── service/
│       ├── base/
│       │   ├── BatchOperation<E,T>    → Interface: insertBatch, updateBatch, deleteBatch
│       │   ├── CrudService<E,T>       → Interface: insert, update, delete
│       │   └── ReadableService<E,T>   → Interface: getAll (paginate), findById, getById
│       ├── role/
│       │   ├── RoleService            → Interface
│       │   └── RoleServiceImpl        → Implementation
│       ├── token/
│       │   ├── TokenService           → Interface
│       │   └── TokenServiceImpl       → Implementation
│       └── user/
│           ├── UserService            → Interface
│           └── UserServiceImpl        → Implementation
│
├── config/
│   ├── exception/
│   │   ├── AuthorizedException        → 401 Unauthorized
│   │   ├── ClientException            → 400 Bad Request
│   │   ├── ConflictException          → 409 Conflict (single message)
│   │   ├── MultipleConflictException  → 409 Conflict (nhiều messages)
│   │   ├── NotFoundException          → 404 Not Found
│   │   └── RestExceptionHandler       → @RestControllerAdvice xử lý tất cả exception
│   ├── language/
│   │   ├── LanguageConfig             → Bean MessageSource (i18n)
│   │   ├── LanguageResolverConfig     → Bean LocaleResolver (AcceptHeader)
│   │   ├── LocalizationUtils          → Utility lấy message theo locale
│   │   └── ServletRequest             → ThreadLocal giữ HttpServletRequest
│   └── security/
│       ├── cors/
│       │   └── CorsProperties         → @ConfigurationProperties(prefix = "app.security.cors")
│       ├── password/
│       │   └── CustomPasswordEncoder  → HMAC-SHA256 pre-process + BCrypt
│       ├── route/
│       │   ├── BypassRouteProperties  → @ConfigurationProperties(prefix = "bypass")
│       │   └── BypassRoutesYamlLoader → Load bypass-routes.yml
│       ├── CustomUserDetailService    → UserDetailsService impl
│       ├── CustomUserDetails          → UserDetails impl (wrap UserDTO)
│       ├── JwtTokenFilter             → OncePerRequestFilter
│       ├── JwtTokenProvider           → Tạo/xác thực JWT, sinh refresh token
│       ├── SecurityConfig             → Bean PasswordEncoder, AuthenticationProvider, AuthenticationManager
│       └── WebSecurityConfig          → SecurityFilterChain, CORS config, @EnableMethodSecurity
│
├── constant/
│   ├── CookieKeyConstant              → "refreshToken", "isLoggedIn"
│   ├── KeywordConstant                → "#", "@", " "
│   ├── MessageKeys                    → Hằng số message key i18n
│   ├── SecurityConstant               → "Bearer ", "Authorization"
│   └── type/
│       └── HTypeTokenInvalid          → Enum: ACCESS_TOKEN_INVALID, REFRESH_TOKEN_INVALID
│
├── domain/
│   ├── dto/
│   │   ├── paginate/
│   │   │   ├── Pagination             → page, perPage, lastPage, total
│   │   │   └── PaginationDTO<E>       → data (List), pagination
│   │   ├── RoleDTO
│   │   ├── TokenDTO
│   │   ├── TokenUpdateDTO
│   │   ├── UserDTO                    → @JsonIgnoreProperties(value = "password")
│   │   ├── UserInsertDTO
│   │   ├── UserLoginDTO
│   │   └── UserRegisterDTO
│   └── model/
│       ├── Role
│       ├── Token
│       └── User
│
├── utility/
│   ├── CookieUtility                  → set/get/delete cookie (HttpOnly, Secure tự động)
│   └── PaginationUtility              → Wrapper PageHelper
│
├── validator/
│   └── HDateValidator                 → ConstraintValidator cho @HVDate
│
└── web/
    ├── base/
    │   └── RestAPI                    → Meta-annotation = @RestController + @RequestMapping
    └── controller/
        └── UserController             → POST /api/v1/users/register
```

**Nguồn phân tích:**
- file: `src/main/java/com/project/mycv/**`

---

## Quy ước đặt tên

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| Entity/Model | PascalCase, ánh xạ trực tiếp DB table | `User`, `Token`, `Role` |
| DTO | `<Entity>DTO` | `UserDTO`, `TokenDTO`, `RoleDTO` |
| Insert DTO | `<Entity>InsertDTO` | `UserInsertDTO` |
| Register DTO | `<Entity>RegisterDTO` | `UserRegisterDTO` |
| Login DTO | `<Entity>LoginDTO` | `UserLoginDTO` |
| Update DTO | `<Entity>UpdateDTO` | `TokenUpdateDTO` |
| Response | `<Entity>Response` hoặc `<Action>Response` | `UserLoginResponse` |
| Mapper (MyBatis) | `<Entity>Mapper` | `UserMapper`, `TokenMapper` |
| Service Interface | `<Entity>Service` | `UserService`, `TokenService` |
| Service Impl | `<Entity>ServiceImpl` | `UserServiceImpl` |
| Controller | `<Entity>Controller` | `UserController` |
| Constants | PascalCase + Constant suffix | `MessageKeys`, `SecurityConstant` |
| Enum type | `HType<Name>` | `HTypeTokenInvalid` |
| Custom Annotation | `HV<Name>` | `HVDate` |
| Custom Validator | `H<Name>Validator` | `HDateValidator` |
| DB column → Java field | snake_case → camelCase (MyBatis `map-underscore-to-camel-case: true`) | `role_name` → `roleName` |

---

## Luồng dữ liệu hệ thống

```
Client (HTTP Request)
  │
  ▼
[CORS Filter] ← CorsConfigurationSource (WebSecurityConfig)
  │
  ▼
[JwtTokenFilter] ← OncePerRequestFilter
  │  ├─ Kiểm tra bypass routes (bypass-routes.yml)
  │  ├─ Đọc Authorization header ("Bearer <token>")
  │  ├─ JwtTokenProvider.extractUsername()
  │  └─ JwtTokenProvider.validateToken() → set SecurityContext
  │
  ▼
[SecurityFilterChain] ← WebSecurityConfig
  │  ├─ Bypass: /api/v1/users/login, /api/v1/users/register, /actuator/health
  │  └─ Còn lại: authenticated()
  │
  ▼
[@RestAPI Controller] ← @RestController + @RequestMapping
  │
  ▼
[Service Layer] ← Business logic, validation, exception throw
  │
  ▼
[MyBatis Mapper] ← Interface + XML (resources/mappers/)
  │
  ▼
[PostgreSQL Database]
  │
  ▼
[RestData<T>] ← RestResponse.success() / RestResponse.errors()
  │
  ▼
Client (HTTP Response: JSON)
```

**Exception flow:**
```
Exception thrown in Service/Filter
  ↓
RestExceptionHandler (@RestControllerAdvice)
  ↓
LocalizationUtils.getLocalizeMessage() ← i18n/messages_{locale}.properties
  ↓
RestResponse.error() hoặc RestResponse.errors()
  ↓
JSON: { "status": <code>, "type": "<ExceptionName>", "errors": ["..."] }
```

---

# 2. 🛡️ SPRING SECURITY & AUTHENTICATION

## Cơ chế xác thực

### Tổng quan
- **Cơ chế:** JWT Stateless (không dùng Session)
- **Access Token:** JWT ký bằng HMAC-SHA256, chứa `id`, `role`, `username`
- **Refresh Token:** ULID string (26 ký tự), lưu DB bảng `tokens`
- **Session Policy:** `STATELESS`

### Token expiration (từ `application.yaml`)
| Token | Default | Đơn vị |
|-------|---------|--------|
| Access Token | 600 | giây (10 phút) |
| Refresh Token | 604800 | giây (7 ngày) |

### Filter Chain thứ tự
```
DisableEncodeUrlFilter
→ SecurityContextHolderFilter
→ WebAsyncManagerIntegrationFilter
→ HeaderWriterFilter
→ CorsFilter
→ LogoutFilter
→ JwtTokenFilter          ← custom filter
→ UsernamePasswordAuthenticationFilter (bỏ qua, stateless)
→ ...
→ AuthorizationFilter
```

### Components chi tiết

| Component | Class | Mô tả |
|-----------|-------|-------|
| `SecurityFilterChain` | `WebSecurityConfig` | Cấu hình filter chain, CORS, exception handling |
| `JwtTokenFilter` | `JwtTokenFilter` | Đọc `Authorization` header, xác thực token mỗi request |
| `JwtTokenProvider` | `JwtTokenProvider` | Tạo access token (JWT), tạo refresh token (ULID), validate token |
| `UserDetailsService` | `CustomUserDetailService` | Load user từ DB theo username/email |
| `UserDetails` | `CustomUserDetails` | Wrap `UserDTO`, trả về authorities từ role |
| `AuthenticationProvider` | `DaoAuthenticationProvider` | Xác thực username/password |
| `PasswordEncoder` | `CustomPasswordEncoder` | HMAC-SHA256(salt) → BCrypt |
| `AuthenticationManager` | Bean trong `SecurityConfig` | Inject từ `AuthenticationConfiguration` |

**Nguồn phân tích:**
- file: `config/security/WebSecurityConfig.java`, class: `WebSecurityConfig`
- file: `config/security/JwtTokenFilter.java`, class: `JwtTokenFilter`, method: `doFilterInternal`
- file: `config/security/JwtTokenProvider.java`, class: `JwtTokenProvider`, method: `generateAccessToken`, `generateRefreshToken`, `validateToken`
- file: `config/security/SecurityConfig.java`, class: `SecurityConfig`
- file: `config/security/password/CustomPasswordEncoder.java`, class: `CustomPasswordEncoder`, method: `preprocess`

### Password Encoding
```
rawPassword
  → HMAC-SHA256(salt) → Base64 string
  → BCrypt(Base64 string)
  → lưu vào DB
```
- Salt lấy từ env: `${app.security.password.salt}`

### Refresh Token Flow
```
Login → JwtTokenProvider.generateRefreshToken()
  → UlidCreator.getUlid().toString()  (26 ký tự)
  → lưu DB bảng tokens (is_revoked=false, is_expired=false, expiry_date)
  → trả về String refreshToken trong UserLoginResponse
```

---

## Cơ chế phân quyền

- `@EnableMethodSecurity` đã bật tại `WebSecurityConfig`
- Authorities format: `"ROLE_ADMIN"`, `"ROLE_USER"` (lấy từ `role_name` DB)
- **`@PreAuthorize`, `@Secured` trên từng method:** [Chưa triển khai - chưa thấy usage trong controller]
- Public routes (bypass):
  - `POST /api/v1/users/login`
  - `POST /api/v1/users/register`
  - `GET /actuator/health`

**Nguồn phân tích:**
- file: `config/security/WebSecurityConfig.java`, class: `WebSecurityConfig`
- file: `config/security/CustomUserDetails.java`, method: `getAuthorities`
- file: `resources/config/security/bypass-routes.yml`

---

## Xử lý lỗi (Exception Handling)

### Global Handler
- file: `config/exception/RestExceptionHandler.java`
- class: `RestExceptionHandler` (`@RestControllerAdvice`)

### Danh sách Exception → HTTP Status

| Exception | HTTP Status | Mô tả |
|-----------|-------------|-------|
| `NotFoundException` | 404 | Resource không tìm thấy |
| `UsernameNotFoundException` | 404 | User không tồn tại |
| `ConflictException` | 409 | Xung đột dữ liệu (1 message) |
| `MultipleConflictException` | 409 | Xung đột dữ liệu (nhiều message) |
| `ConstraintViolationException` | 400 | Vi phạm validation |
| `ClientException` | 400 | Lỗi phía client |
| `AuthorizedException` | 401 | Chưa xác thực |
| `BindException` | 400 | Lỗi binding/validation DTO |
| `HttpClientErrorException` | 403 | Forbidden |
| `AccessDeniedException` | 403 | Không có quyền |
| `RuntimeException` | 500 | Lỗi server |

### Response format chuẩn hóa

**Tất cả response lỗi** đều dùng `errors[]` (array):
```json
{
  "status": 409,
  "type": "MultipleConflictException",
  "errors": [
    "Username already exists",
    "Email already exists"
  ]
}
```

```json
{
  "status": 400,
  "type": "ClientException",
  "errors": ["Username or password is incorrect"]
}
```

**Response thành công:**
```json
{
  "status": 200,
  "type": "Success",
  "data": { ... }
}
```

**AuthenticationEntryPoint (401):** `res.sendError(SC_UNAUTHORIZED)` — inline lambda trong `WebSecurityConfig`  
**AccessDeniedHandler (403):** `res.sendError(SC_FORBIDDEN)` — inline lambda trong `WebSecurityConfig`

---

# 3. 🧩 COMMON / SHARED COMPONENTS

### 1. `RestData<T>`
- **Mục đích:** Chuẩn hóa tất cả HTTP response (cả success và error)
- **Cách hoạt động:** Generic wrapper, dùng `@JsonInclude(NON_NULL)` để chỉ serialize field có giá trị
- **Fields:** `status` (int), `type` (String), `errors` (List<String>), `data` (T)
- **Không được viết lại** — đã đủ dùng
- **Nguồn:** `application/response/base/RestData.java`

### 2. `RestResponse`
- **Mục đích:** Static factory methods tạo `RestData`
- **Methods:** `success(...)`, `error(status, type, message)`, `errors(status, type, List<String>)`
- **Nguồn:** `application/response/base/RestResponse.java`

### 3. `CookieUtility`
- **Mục đích:** Tiện ích tạo/đọc/xóa HTTP Cookie
- **Cách hoạt động:** Tự động set `Secure=false` khi localhost, `Secure=true` khi production; `HttpOnly=true` by default
- **Lưu ý:** Hiện tại chưa được gọi trong controller nào (refresh token trả về JSON, không set cookie)
- **Nguồn:** `utility/CookieUtility.java`

### 4. `PaginationUtility`
- **Mục đích:** Wrapper cho PageHelper, chuẩn hóa phân trang
- **Cách hoạt động:** `paginate(Supplier<List<E>>, page, pageSize)` — page bắt đầu từ 0 (frontend), chuyển thành 1-based cho PageHelper
- **Nguồn:** `utility/PaginationUtility.java`

### 5. `LocalizationUtils`
- **Mục đích:** Lấy message đã dịch theo locale request
- **Cách hoạt động:** Đọc `Accept-Language` header → resolve locale → lấy message từ `i18n/messages_{locale}.properties`
- **Locale mặc định:** `Locale.ROOT` (nếu không có Accept-Language)
- **Nguồn:** `config/language/LocalizationUtils.java`, `config/language/LanguageResolverConfig.java`

### 6. `CustomPasswordEncoder`
- **Mục đích:** Tăng cường bảo mật password bằng HMAC-SHA256 server-side salt trước khi BCrypt
- **Cách hoạt động:** `rawPassword → HMAC-SHA256(salt) → Base64 → BCrypt`
- **Không được viết lại** — đây là chuỗi encode bắt buộc
- **Nguồn:** `config/security/password/CustomPasswordEncoder.java`

### 7. `HVDate` + `HDateValidator`
- **Mục đích:** Custom annotation validate định dạng ngày dạng String (regex pattern)
- **Default pattern:** `"yyyy/MM/dd"`
- **Cách dùng:** `@HVDate(pattern = "dd-MM-yyyy")` trên String field trong DTO
- **Nguồn:** `annotation/validator/HVDate.java`, `validator/HDateValidator.java`

### 8. `RestAPI`
- **Mục đích:** Meta-annotation gộp `@RestController` + `@RequestMapping`
- **Cách dùng:** `@RestAPI("/api/v1/users")` thay cho 2 annotation
- **Nguồn:** `web/base/RestAPI.java`

### 9. Base Service/Mapper interfaces
- **Mục đích:** Generic CRUD + Read contracts
- **Hierarchy:** `ReadableMapper<E,T>`, `CrudMapper<E,T>`, `ReadableService<E,T>`, `CrudService<E,T>`, `BatchOperation<E,T>`
- **Nguồn:** `application/mapper/base/`, `application/service/base/`

---

# 4. 🗄️ DATABASE & ENTITY MAPPING

## Bảng `users`

**Nguồn phân tích:**
- file: `resources/mappers/UserMapper.xml`
- file: `domain/model/User.java`
- file: `domain/dto/UserDTO.java`

| Column | Java Field | Type (DB) | PK | FK | Nullable |
|--------|-----------|-----------|----|----|----------|
| `id` | `id` | BIGSERIAL/BIGINT | ✅ | — | NO |
| `username` | `username` | VARCHAR | — | — | NO |
| `password` | `password` | VARCHAR | — | — | NO |
| `email` | `email` | VARCHAR | — | — | NO |
| `status` | `status` | INT | — | — | NO |
| `role_id` | `role` (join) | BIGINT | — | ✅ → `roles.id` | YES |
| `created_date` | `createdDate` | TIMESTAMP | — | — | YES |
| `updated_date` | `updatedDate` | TIMESTAMP | — | — | YES |

**Unique constraints:** `username` (unique), `email` (unique) — validate ở tầng service
**Ghi chú:** `UserDTO.password` bị `@JsonIgnoreProperties` — không serialize ra response

---

## Bảng `tokens`

**Nguồn phân tích:**
- file: `resources/mappers/TokenMapper.xml`
- file: `domain/model/Token.java`

| Column | Java Field | Type (DB) | PK | FK | Nullable |
|--------|-----------|-----------|----|----|----------|
| `id` | `id` | BIGSERIAL/BIGINT | ✅ | — | NO |
| `user_id` | `userId` | BIGINT | — | ✅ → `users.id` | NO |
| `refresh_token` | `refreshToken` | VARCHAR/CHAR(26) | — | — | NO |
| `is_revoked` | `isRevoked` | BOOLEAN | — | — | NO |
| `is_expired` | `isExpired` | BOOLEAN | — | — | NO |
| `device_info` | `deviceInfo` | VARCHAR | — | — | YES |
| `expiry_date` | `expiredAt` | TIMESTAMP | — | — | NO |
| `created_date` | `createdAt` | TIMESTAMP | — | — | YES |
| `updated_date` | `updatedAt` | TIMESTAMP | — | — | YES |

**Ghi chú:** `refresh_token` lưu dạng ULID String (26 ký tự), recommend DB type `CHAR(26)` hoặc `VARCHAR(26)`

---

## Bảng `roles`

**Nguồn phân tích:**
- file: `resources/mappers/RoleMapper.xml`
- file: `domain/model/Role.java`

| Column | Java Field | Type (DB) | PK | FK | Nullable |
|--------|-----------|-----------|----|----|----------|
| `id` | `id` | BIGSERIAL/BIGINT | ✅ | — | NO |
| `role_name` | `roleName` | VARCHAR | — | — | NO |
| `description` | `description` | VARCHAR | — | — | YES |

---

## Quan hệ giữa các bảng

```
roles (1) ──────── (N) users
                        │
users (1) ──────── (N) tokens
```

- `users.role_id` → `roles.id` (ManyToOne)
- `tokens.user_id` → `users.id` (ManyToOne)

---

## MyBatis Mapper XML đặc biệt

**UserMapper — `findByUsername`:** tìm theo cả username VÀ email (dùng cho login với cả 2 field)
```sql
WHERE u.username = #{username} OR u.email = #{username}
```

**UserMapper — `findByEmail`:** tìm chính xác theo email (dùng cho validate unique khi register)
```sql
WHERE u.email = #{email}
```

**TokenMapper — `revokeToken`:** chỉ revoke nếu chưa bị revoke
```sql
WHERE refresh_token = #{refreshToken} AND is_revoked = false
```

---

# 5. 🔄 CẤU HÌNH HỆ THỐNG

## `application.yaml`

**Nguồn phân tích:**
- file: `src/main/resources/application.yaml`

```yaml
# Database
spring.datasource:
  url: jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:mycv}
  username: ${DB_USERNAME:postgres}
  password: ${DB_USERNAME:password}   # ⚠️ BUG: dùng DB_USERNAME thay vì DB_PASSWORD
  driver-class-name: org.postgresql.Driver

# MyBatis
mybatis:
  mapper-locations: classpath:mappers/*.xml
  type-aliases-package: com.project.mycv.domain.model
  map-underscore-to-camel-case: true

# JWT
jwt:
  expiration:
    access-token: ${JWT_ACCESS_TOKEN:600}    # 10 phút
    refresh-token: ${JWT_REFRESH_TOKEN:604800}  # 7 ngày
  secret-key: ${JWT_SECRET_KEY}              # BẮT BUỘC set env

# Cookie
cookie:
  domain: ${COOKIE_DOMAIN:localhost}

# App
app:
  client.url: ${CLIENT_URL:http://localhost:3000}
  security:
    cors.allowed-origins: [${CLIENT_URL:http://localhost:3000}]
    password.salt: ${PASSWORD_SALT}          # BẮT BUỘC set env

# API version
api:
  version1: api/v1

# Actuator
management:
  endpoints.web.exposure.include: health,info
  endpoint.health.show-details: always
  health.diskspace.enabled: true

# Logging
logging:
  config: classpath:config/log/logback.xml
```

## Environment Variables bắt buộc

| Variable | Mô tả | Default |
|----------|-------|---------|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `mycv` |
| `DB_USERNAME` | DB username | `postgres` |
| `DB_PASSWORD` | DB password | ⚠️ **BUG: đang dùng `DB_USERNAME`** |
| `JWT_SECRET_KEY` | JWT signing key | **REQUIRED** |
| `JWT_ACCESS_TOKEN` | Access token TTL (giây) | `600` |
| `JWT_REFRESH_TOKEN` | Refresh token TTL (giây) | `604800` |
| `PASSWORD_SALT` | HMAC salt cho password | **REQUIRED** |
| `COOKIE_DOMAIN` | Cookie domain | `localhost` |
| `CLIENT_URL` | Frontend URL (CORS) | `http://localhost:3000` |

## CORS

- Allowed Origins: `${CLIENT_URL:http://localhost:3000}`
- Allowed Methods: `GET, POST, PUT, DELETE, OPTIONS`
- Allowed Headers: `*`
- Allow Credentials: `true`

## Bypass Routes (Security)

| Path | Method |
|------|--------|
| `/api/v1/users/login` | POST |
| `/api/v1/users/register` | POST |
| `/actuator/health` | GET |

**Nguồn:** `resources/config/security/bypass-routes.yml`

## i18n

- Basename: `i18n/messages`
- Files: `messages_en.properties`, `messages_vi.properties`
- Locale resolver: `AcceptHeaderLocaleResolver` (header `Accept-Language`)
- Default locale: `Locale.ROOT`

---

# 6. 📡 TÍCH HỢP NGOÀI HỆ THỐNG

| Loại | Trạng thái | Ghi chú |
|------|-----------|---------|
| REST Client / OpenFeign | [Chưa triển khai] | — |
| WebClient | [Chưa triển khai] | — |
| SMTP / Email | [Chưa triển khai] | — |
| AWS S3 / File Storage | [Chưa triển khai] | — |
| Redis / Cache | [Chưa triển khai] | — |
| RabbitMQ / Kafka | [Chưa triển khai] | — |
| OAuth2 / Social Login | [Chưa triển khai] | — |
| Actuator (health check) | ✅ Đã cấu hình | `/actuator/health`, `/actuator/info` |

---

# 7. 📝 TRẠNG THÁI HỆ THỐNG HIỆN TẠI

**Ngày tạo tài liệu:** 2026-05-28

## ✅ Đã triển khai

- [x] Spring Boot 4.x project setup + Maven
- [x] JWT Authentication (stateless, access token + refresh token)
- [x] Custom Password Encoder (HMAC-SHA256 + BCrypt)
- [x] JWT Filter (`JwtTokenFilter`) xác thực mỗi request
- [x] Dynamic bypass routes từ YAML file
- [x] CORS configuration từ `@ConfigurationProperties`
- [x] Global Exception Handler (`RestExceptionHandler`)
- [x] Chuẩn hóa response format (`RestData` — luôn dùng `errors[]` array)
- [x] i18n (EN + VI, AcceptHeader resolver)
- [x] MyBatis + PostgreSQL integration
- [x] Phân trang với PageHelper
- [x] User register với validate unique username + email (trả cả 2 lỗi)
- [x] User login
- [x] Logout (revoke refresh token)
- [x] Refresh access token
- [x] CRUD base interfaces (generic)
- [x] Cookie utility (HttpOnly, Secure auto-detect)
- [x] Custom date validator (`@HVDate`)
- [x] Role-based authority (từ DB)

## ❌ Chưa triển khai

- [ ] Logout endpoint trong `UserController` (service có nhưng controller chưa expose)
- [ ] Refresh token endpoint trong `UserController`
- [ ] `@PreAuthorize` / `@Secured` trên các API cần phân quyền
- [ ] Email service
- [ ] File upload (config multipart đã có nhưng chưa có controller)
- [ ] Redis caching
- [ ] External API integration
- [ ] Swagger / OpenAPI documentation
- [ ] Flyway / Liquibase migration
- [ ] Unit test / Integration test (chỉ có placeholder test)
- [ ] Docker configuration
- [ ] `RoleController` (mapper và service đã có)

## ⚠️ Technical Debt & Điểm cần chú ý

1. **BUG nghiêm trọng:** `application.yaml` dùng `${DB_USERNAME:password}` cho password thay vì `${DB_PASSWORD:password}` → sẽ fail khi deploy với env vars thực tế
2. `TokenServiceImpl.insert()` check trùng refresh token trước khi insert — nhưng ULID là unique globally, có thể bỏ check này
3. `CookieUtility` đã implement đầy đủ nhưng chưa được dùng trong controller nào — refresh token đang trả về trong JSON body thay vì HttpOnly cookie
4. `UserDTO` dùng `Role` model thay vì `RoleDTO` — inconsistency giữa model và DTO layer
5. `TokenDTO` đã có nhưng không được dùng — mapper trả về `Token` model trực tiếp
6. `TokenServiceImpl.validateToken()` không tự động expire token khi phát hiện hết hạn — chỉ log
7. `extractUserId()` trong `JwtTokenProvider` trả về `String` nhưng claim `id` thực tế là `Long` — có thể gây lỗi runtime

---

# 8. 📌 UPDATE LOG

[Không đủ dữ liệu — không tìm thấy git log, CHANGELOG, hay migration files trong workspace]

| Date | Change | Evidence |
|------|--------|----------|
| — | — | — |

