import { defineConfig } from "tsdown"

export default defineConfig({
  entry: ["./src/index.ts"],
  outDir: "./dist",
  format: ["cjs"],
  target: "node20",
  platform: "node",
  sourcemap: true,
  clean: true,
  dts: false,
  external: ["chalk"]
})