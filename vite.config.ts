import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: [
                "favicon.ico",
                "apple-touch-icon.png",
                "web-app-manifest-192x192.png",
            ],
            manifest: {
                name: "Skiftplan Smelteverk Sauda",
                short_name: "Skiftplan",
                description: "Skiftplan for smelteverk Sauda",
                theme_color: "#0f5f13",
                background_color: "#F4EBDA",
                display: "standalone",
                icons: [
                    {
                        src: "web-app-manifest-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "maskable",
                    },
                    {
                        src: "web-app-manifest-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    build: {
        target: "es2022",
    },
});
