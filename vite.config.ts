import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    tanstackStart(),
    react(),
    nitro(),
    tailwindcss(),
    tsConfigPaths()
  ],
  ssr: {
    noExternal: ["react-leaflet", "leaflet"],
  },
  optimizeDeps: {
    include: ["react-leaflet", "leaflet"],
  },
});
