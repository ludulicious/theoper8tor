import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { parse } from "yaml";
import { pageSources } from "../shared/content-sources.mjs";

const require = createRequire(import.meta.url);
const contentRequire = createRequire(require.resolve("@nuxt/content"));
const micromatch = contentRequire("micromatch");
const slugify = contentRequire("slugify");
export const root = resolve(import.meta.dirname, "..");

// Match Nuxt Content's filename processing, including numeric ordering and index files.
export function pagePath(file, source) {
  const fixed = source.include.includes("*")
    ? source.include.split("*")[0]
    : "";
  const stem = `${source.prefix}/${file.slice(fixed.length).replace(/\.md$/, "")}`;
  const path = stem
    .split("/")
    .filter(Boolean)
    .map((part) =>
      slugify(part.replace(/^(\d+\.)/, "").replace(/^index$/, ""), {
        lower: true,
      }),
    )
    .filter(Boolean)
    .join("/");
  return `/${path}`;
}

export function readPages(projectRoot = root) {
  const files = readdirSync(`${projectRoot}/content`, {
    recursive: true,
  }).filter((file) => file.endsWith(".md"));
  const documents = [];
  for (const [collection, source] of Object.entries(pageSources)) {
    for (const file of micromatch(files, source.include, {
      ignore: source.exclude || [],
    })) {
      const text = readFileSync(`${projectRoot}/content/${file}`, "utf8");
      const [, frontmatter, body] = text.split(/^---\s*$/m);
      documents.push({
        file: `content/${file}`,
        collection,
        path: pagePath(file, source),
        data: parse(frontmatter),
        body,
      });
    }
  }
  return documents;
}
