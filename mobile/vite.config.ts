import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  build: {
    target: "esnext",
  },
  preview: {
    port: 8100,
  },
  plugins: [react()],
});
