import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000, // Cổng dev server
    strictPort: true, // Nếu cổng 3000 đã dùng, sẽ báo lỗi thay vì tự động đổi cổng khác
  },
  plugins: [
    react(),
    tailwindcss(), // Tích hợp Tailwind CSS v4 qua Vite plugin
  ],
  resolve: {
    alias: {
      // Alias "@" trỏ về thư mục src/ để import ngắn gọn hơn
      "@": "/src",
    },
  },
});
