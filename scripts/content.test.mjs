import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { parse } from "yaml";
import { readPages, pagePath, root } from "./content-pages.mjs";
import { pageSources } from "../shared/content-sources.mjs";
const pages = readPages();
const redirects = JSON.parse(
  readFileSync(`${root}/shared/legacy-redirects.json`, "utf8"),
);
const known = new Set(pages.map((page) => page.path));
test("all pages have unique public addresses and required copy", () => {
  assert.equal(known.size, pages.length);
  assert.equal(pages.filter((page) => page.collection === "blog").length, 4);
  assert.ok(known.has("/newsletter"));
  assert.ok(known.has("/intentionalcoffeechat"));
  for (const page of pages) {
    assert.ok(page.data.title?.trim(), page.file);
    assert.ok(page.data.description?.trim(), page.file);
    assert.ok(page.body.includes("# "), page.file);
  }
});
test("ordering numbers do not change page addresses; new pages inherit collection prefixes", () => {
  assert.equal(
    pagePath("02.services/09.new-service.md", pageSources.offers),
    "/new-service",
  );
  assert.equal(
    pagePath("06.blog/09.new-article.md", pageSources.blog),
    "/blog/b/new-article",
  );
  assert.equal(
    pagePath("02.services/00.index.md", pageSources.services),
    "/services",
  );
});
test("all content links and image files resolve within the migrated project", () => {
  for (const page of pages) {
    for (const match of page.body.matchAll(/(?:\]\(<?|to=")([^)>"\s]+)/g)) {
      const path = match[1].split(/[?#]/)[0];
      if (!path.startsWith("/")) continue;
      assert.ok(
        path.startsWith("/images/")
          ? existsSync(`${root}/public${path}`)
          : known.has(path) || redirects[path],
        `${page.file}: ${path}`,
      );
    }
    if (page.data.image)
      assert.ok(existsSync(`${root}/public${page.data.image.src}`), page.file);
  }
});
test("navigation, redirect destinations and Studio page previews are valid", () => {
  const menu = parse(
    readFileSync(`${root}/content/08.settings/menu.yml`, "utf8"),
  );
  const site = parse(
    readFileSync(`${root}/content/08.settings/site.yml`, "utf8"),
  );
  for (const link of [...menu.items, menu.action, ...site.footerLinks]) {
    if (link.to.startsWith("/"))
      assert.ok(known.has(link.to) || redirects[link.to], link.to);
  }
  assert.ok(existsSync(`${root}/public${site.logo.src}`));
  for (const target of Object.values(redirects))
    if (target.startsWith("/")) assert.ok(known.has(target), target);
  const preview = JSON.parse(
    readFileSync(`${root}/studio.preview.json`, "utf8"),
  );
  for (const page of pages) assert.equal(preview[page.file], page.path);
});
