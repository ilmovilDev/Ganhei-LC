import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true, // describe, it, expect sem import
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // mesmo alias do tsconfig
    },
  },
});
