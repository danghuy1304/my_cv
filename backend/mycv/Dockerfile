# ============================================================
# Stage 1: Build — Maven + JDK 21
# ============================================================
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper và pom trước để cache layer dependency
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source và build
COPY src ./src
RUN ./mvnw package -DskipTests -B

# ============================================================
# Stage 2: Runtime — JRE 21 (nhẹ hơn JDK)
# ============================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Tạo thư mục uploads
RUN mkdir -p /app/api/v1/uploads/avatars

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
