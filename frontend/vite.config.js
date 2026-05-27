import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
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
