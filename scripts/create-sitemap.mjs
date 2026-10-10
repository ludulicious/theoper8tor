import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";
import { readPages, root } from "./content-pages.mjs";
import redirects from "../shared/legacy-redirects.json" with { type: "json" };
const pages = readPages();
const site = parse(
  readFileSync(`${root}/content/08.settings/site.yml`, "utf8"),
);
const escape = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const paths = [...new Set(pages.map((page) => page.path))].sort();
writeFileSync(
  `${root}/public/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${escape(site.url + encodeURI(path))}</loc></url>`).join("\n")}\n</urlset>\n`,
);
writeFileSync(
  `${root}/public/robots.txt`,
  `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`,
);
writeFileSync(
  `${root}/public/_redirects`,
  Object.entries(redirects)
    .map(([from, to]) => `${from} ${to} 301`)
    .join("\n") + "\n",
);
const preview = {
  "content/08.settings/site.yml": "/",
  "content/08.settings/menu.yml": "/",
};
for (const page of pages) preview[page.file] = page.path;
for (const file of readdirSync(`${root}/content/07.photos`).filter(
  (file) => file.endsWith(".yml") && !file.startsWith("."),
)) {
  const photo = parse(
    readFileSync(`${root}/content/07.photos/${file}`, "utf8"),
  );
  const matches = pages
    .filter(
      (page) =>
        page.body.includes(photo.image.src) ||
        page.data.image?.src === photo.image.src,
    )
    .map((page) => page.path);
  preview[`content/07.photos/${file}`] = matches.length ? matches : "/";
}
for (const file of readdirSync(`${root}/content/09.videos`).filter(
  (file) => file.endsWith(".yml") && !file.startsWith("."),
)) {
  const slug = file.replace(/\.yml$/, "");
  preview[`content/09.videos/${file}`] = [
    "/videos",
    ...pages
      .filter((page) => page.body.includes(`video="${slug}"`))
      .map((page) => page.path),
  ];
}
writeFileSync(
  `${root}/studio.preview.json`,
  JSON.stringify(preview, null, 2) + "\n",
);
