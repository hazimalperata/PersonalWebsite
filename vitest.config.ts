import { defineConfig } from "vitest/config";
import path from "node:path";

const alias = {
  // `server-only` throws outside the react-server condition; stub it for tests.
  "server-only": path.resolve(__dirname, "src/test/server-only.ts"),
  "@": path.resolve(__dirname, "src"),
};

export default defineConfig({
  resolve: { alias },
  test: {
    passWithNoTests: true,
    projects: [
      {
        resolve: { alias },
        test: {
          name: "node",
          include: ["src/**/*.test.ts", "src/**/*.test.tsx", "scripts/**/*.test.mjs"],
          exclude: ["src/components/**"],
          environment: "node",
        },
      },
      {
        resolve: { alias },
        test: {
          name: "components",
          include: ["src/components/**/*.test.ts", "src/components/**/*.test.tsx"],
          environment: "jsdom",
        },
      },
    ],
  },
});
