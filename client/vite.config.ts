import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // target: "http://localhost:4000",
        target: "http://ec2-13-61-4-237.eu-north-1.compute.amazonaws.com",
        // changeOrigin: true,
      },
    },
  },
});
