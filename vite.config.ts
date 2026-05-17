import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/** Telegram Mini App SDK — Vite при build иначе выкидывает внешний script из index.html. */
function injectTelegramWebApp(): Plugin {
  return {
    name: "inject-telegram-web-app",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const src = "https://telegram.org/js/telegram-web-app.js";
        if (html.includes(src)) return html;
        return html.replace(/<\/head>/i, `<script src="${src}"></script></head>`);
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), injectTelegramWebApp()],
  server: {
    port: 5173
  }
});
