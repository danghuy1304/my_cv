-- Khởi tạo DB sạch: Xóa các bảng cũ nếu đã tồn tại để tránh xung đột khóa ngoại khi chạy lại
DROP TABLE IF EXISTS access_logs CASCADE;
DROP TABLE IF EXISTS cv_activities CASCADE;
DROP TABLE IF EXISTS cv_project_tasks CASCADE;
DROP TABLE IF EXISTS cv_projects CASCADE;
DROP TABLE IF EXISTS cv_educations CASCADE;
DROP TABLE IF EXISTS cv_skills CASCADE;
DROP TABLE IF EXISTS cv_certifications CASCADE;
DROP TABLE IF EXISTS cv_interests CASCADE;
DROP TABLE IF EXISTS cv_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- =========================================================================
-- PHÂN HỆ 1: AUTHENTICATION & AUTHORIZATION (QUẢN LÝ ADMIN)
-- =========================================================================

-- 1. Bảng Quyền hạn (Roles)
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE, -- Ví dụ: 'ROLE_ADMIN', 'ROLE_USER'
    description VARCHAR(255)
);

insert into (role_name, description) values
("ADMIN", "Admin system"),
("USER", "User system")

-- 2. Bảng Người dùng (Users) - Dùng để đăng nhập vào hệ thống quản trị (Admin)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Mật khẩu băm bằng mã hóa BCrypt
    email VARCHAR(100) NOT NULL UNIQUE,
    status INT NOT NULL DEFAULT 1, -- 1: Hoạt động, 0: Bị khóa tài khoản
    role_id BIGINT REFERENCES roles(id) ON DELETE RESTRICT, -- Khóa ngoại phẳng đúng bài MyBatis
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Nối phẳng với User sở hữu token
    refresh_token UUID NOT NULL UNIQUE, -- Chuỗi ULID
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE, -- TRUE nếu token đã bị hủy (ví dụ: khi bấm Logout)
    is_expired BOOLEAN NOT NULL DEFAULT FALSE, -- TRUE nếu token đã quá hạn sử dụng
    device_info VARCHAR(255), -- Lưu thông tin thiết bị (ví dụ: Chrome - Windows) để người dùng quản lý thiết bị đã đăng nhập
    expiry_date TIMESTAMP NOT NULL, -- Thời điểm token này chính thức hết hạn
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tokens_refresh_token ON tokens(refresh_token);
CREATE INDEX idx_tokens_user_id ON tokens(user_id);

-- =========================================================================
-- PHÂN HỆ 2: CORE DATA CV PROFILE (QUẢN LÝ NỘI DUNG CHI TIẾT CV)
-- =========================================================================

-- 3. Bảng Thông tin cá nhân & Mục tiêu nghề nghiệp (CV Profiles)
CREATE TABLE cv_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE, -- Kết nối trực tiếp với tài khoản sở hữu
    full_name VARCHAR(100) NOT NULL, -- Ví dụ: Đặng Đình Huy
    title VARCHAR(100), -- Ví dụ: Web developer
    birthday DATE, -- Ví dụ: 2002-04-13
    phone VARCHAR(20), -- Ví dụ: 0369555134
    email VARCHAR(100), -- Ví dụ: huydang2132@gmail.com
    github_url VARCHAR(255), -- Ví dụ: https://github.com/danghuy1304
    address VARCHAR(255), -- Ví dụ: Từ Liêm, Hà Nội
    summary_short TEXT, -- Mục tiêu ngắn hạn (1 năm tới)
    summary_long TEXT, -- Mục tiêu dài hạn (3 - 5 năm tiếp)
    avatar_url VARCHAR(255),
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bảng Kỹ năng chuyên môn (Skills)
CREATE TABLE cv_skills (
    id BIGSERIAL PRIMARY KEY,
    cv_id BIGINT REFERENCES cv_profiles(id) ON DELETE CASCADE,
    skill_category VARCHAR(50) NOT NULL, -- Phân loại: 'Front-end', 'Back-end', 'Database', 'DevOps'
    skill_name VARCHAR(100) NOT NULL, -- Tên công nghệ: 'Spring Boot', 'ReactJS', 'PostgreSQL', 'RabbitMQ'
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bảng Học vấn (Education)
CREATE TABLE cv_educations (
    id BIGSERIAL PRIMARY KEY,
    cv_id BIGINT REFERENCES cv_profiles(id) ON DELETE CASCADE,
    school_name VARCHAR(150) NOT NULL, -- Ví dụ: Đại học Công nghiệp Hà Nội
    major VARCHAR(150) NOT NULL, -- Ví dụ: Kỹ thuật phần mềm
    gpa VARCHAR(10), -- Ví dụ: 3.16
    start_date DATE, -- Tháng/năm bắt đầu học (ví dụ: 2020-10-01)
    end_date DATE -- Tháng/năm tốt nghiệp (ví dụ: 2024-06-01)
);

-- 6. Bảng Dự án thực tế (Projects)
CREATE TABLE cv_projects (
    id BIGSERIAL PRIMARY KEY,
    cv_id BIGINT REFERENCES cv_profiles(id) ON DELETE CASCADE,
    project_name VARCHAR(150) NOT NULL, -- Ví dụ: Ecommerce website, Invoice app...
    company_name VARCHAR(150), -- Ví dụ: Công ty cổ phần VTI
    team_size INT, -- Số lượng thành viên (ví dụ: 9, 4, 2...)
    role_in_project VARCHAR(100), -- Ví dụ: Java Developer, Full-Stack Developer
    tech_frontend TEXT, -- Danh sách tech: VueJS, Thymeleaf, ReactJS...
    tech_backend TEXT, -- Danh sách tech: Spring Boot, Django, PostgreSQL...
    tech_devops_tools TEXT, -- Danh sách hạ tầng/tool: AWS, RabbitMQ, Kafka...
    url_demo VARCHAR(255), -- Đường dẫn chạy thử sản phẩm thực tế (Mới bổ sung)
    start_date DATE NOT NULL,
    end_date DATE, -- Để trống (NULL) nếu dữ liệu hiển thị là "Nay"
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Bảng Chi tiết các Task công việc trong Dự án (Project Tasks)
-- Tách riêng quan hệ 1-Nhiều để quản lý danh sách gạch đầu dòng mô tả công việc linh hoạt
CREATE TABLE cv_project_tasks (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES cv_projects(id) ON DELETE CASCADE,
    task_description TEXT NOT NULL -- Ví dụ: "Phát triển chức năng gửi mail thông báo..."
);

-- 8. Bảng Hoạt động ngoại khóa & Tình nguyện (Activities)
CREATE TABLE cv_activities (
    id BIGSERIAL PRIMARY KEY,
    cv_id BIGINT REFERENCES cv_profiles(id) ON DELETE CASCADE,
    organization VARCHAR(150) NOT NULL, -- Ví dụ: CLB thanh niên tình nguyện khoa CNTT
    role VARCHAR(100), -- Ví dụ: Tình nguyện viên
    description TEXT, -- Ví dụ: "Tham gia các hoạt động tình nguyện của CLB..."
    start_date DATE,
    end_date DATE
);

-- 9. Bảng Sở thích cá nhân (Interests) - MỚI BỔ SUNG
-- Lưu danh sách các sở thích gạch đầu dòng trên CV
CREATE TABLE cv_interests (
    id BIGSERIAL PRIMARY KEY,
    cv_id BIGINT REFERENCES cv_profiles(id) ON DELETE CASCADE,
    interest_name VARCHAR(100) NOT NULL, -- Ví dụ: Chơi game, Cầu lông, Hoạt động tình nguyện...
    display_order INT DEFAULT 0, -- Thứ tự sắp xếp hiển thị ưu tiên trên UI CV
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. Bảng Chứng chỉ chuyên môn (Certifications) - MỚI BỔ SUNG
-- Quy hoạch sẵn cấu trúc để lưu trữ dữ liệu chứng chỉ công nghệ trong tương lai
CREATE TABLE cv_certifications (
    id BIGSERIAL PRIMARY KEY,
    cv_id BIGINT REFERENCES cv_profiles(id) ON DELETE CASCADE,
    cert_name VARCHAR(150) NOT NULL, -- Ví dụ: 'AWS Certified Developer – Associate'
    issuing_organization VARCHAR(150) NOT NULL, -- Tổ chức cấp (Ví dụ: Amazon Web Services)
    issue_date DATE, -- Ngày cấp chứng chỉ
    expiration_date DATE, -- Ngày hết hạn (để trống nếu có giá trị vĩnh viễn)
    credential_id VARCHAR(100), -- Mã ID định danh của chứng chỉ
    credential_url VARCHAR(255), -- Đường dẫn trực tuyến để verify chứng chỉ
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================================
-- PHÂN HỆ 3: AUDIT & TRACKING (GIÁM SÁT LỊCH SỬ TRUY CẬP)
-- =========================================================================

-- 11. Bảng Ghi log lịch sử thiết bị truy cập công khai
CREATE TABLE access_logs (
    id BIGSERIAL PRIMARY KEY,
    cv_id BIGINT REFERENCES cv_profiles(id) ON DELETE CASCADE,
    ip_address VARCHAR(45) NOT NULL, -- Hỗ trợ cả dải địa chỉ IPv4 và IPv6
    user_agent TEXT, -- Chuỗi thông tin thô thu được từ Header Browser của nhà tuyển dụng
    device_type VARCHAR(50), -- Loại thiết bị tự phân tích: 'Mobile', 'Tablet', 'Desktop', 'Bot'
    browser VARCHAR(50), -- Trình duyệt: 'Chrome', 'Safari', 'Firefox', 'Edge'
    operating_system VARCHAR(50), -- Hệ điều hành: 'Windows', 'MacOS', 'iOS', 'Android'
    location_country VARCHAR(100), -- Quốc gia của người xem (Parse tự động qua IP)
    location_city VARCHAR(100), -- Thành phố của người xem (Parse tự động qua IP)
    accessed_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);