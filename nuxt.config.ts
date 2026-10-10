import { createRequire } from "node:module";
import { readPages } from "./scripts/content-pages.mjs";
import redirects from "./shared/legacy-redirects.json";
export default defineNuxtConfig({
  compatibilityDate: "2026-09-01",
  modules: ["@nuxt/ui", "@nuxt/content", "@nuxt/image"],
  css: ["~/assets/css/main.css"],
  devtools: { enabled: false },
  ui: { colorMode: false, fonts: false },
  icon: { provider: "none", clientBundle: { scan: true } },
  app: {
    head: {
      htmlAttrs: { lang: "en" },
      meta: [{ name: "theme-color", content: "#d9a328" }],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },
  routeRules: Object.fromEntries(
    Object.entries(redirects).map(([from, to]) => [
      from,
      { redirect: { to, statusCode: 301 } },
    ]),
  ),
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: readPages().map((page) => page.path),
      failOnError: true,
    },
  },
  experimental: { payloadExtraction: process.env.NODE_ENV !== "development" },
  hooks: {
    "vite:configResolved"(config) {
      const include = config.optimizeDeps?.include;
      if (!include?.some((entry) => entry.startsWith("@nuxtjs/mdc > "))) return;
      const projectRequire = createRequire(import.meta.url);
      const contentRequire = createRequire(
        projectRequire.resolve("@nuxt/content"),
      );
      const mdcRequire = createRequire(contentRequire.resolve("@nuxtjs/mdc"));
      config.optimizeDeps!.include = include.map((entry) =>
        entry.startsWith("@nuxtjs/mdc > ")
          ? mdcRequire.resolve(entry.slice("@nuxtjs/mdc > ".length))
          : entry,
      );
    },
  },
});
