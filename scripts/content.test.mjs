import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
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
  assert.ok(known.has("/book-a-session/intentional-coffee"));
  for (const page of pages) {
    assert.ok(page.data.title?.trim(), page.file);
    assert.ok(page.data.description?.trim(), page.file);
    assert.ok(
      page.collection === "content" ||
        page.data.studio?.blocks.some((block) => page.data[block.field]?.title),
      page.file,
    );
  }
});
test("ordering numbers do not change page addresses; new pages inherit collection prefixes", () => {
  assert.equal(
    pagePath("02.services/09.new-service.md", pageSources.offers),
    "/book-a-session/new-service",
  );
  assert.equal(
    pagePath("06.blog/09.new-article.md", pageSources.blog),
    "/blog/new-article",
  );
  assert.equal(
    pagePath("pages/01.how-can-help.md", pageSources.content),
    "/how-can-help",
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

test("video library references, thumbnails and Studio previews resolve", () => {
  const preview = JSON.parse(
    readFileSync(`${root}/studio.preview.json`, "utf8"),
  );
  assert.ok(known.has("/videos"));
  const slugs = new Set();
  for (const file of readdirSync(`${root}/content/09.videos`).filter(
    (file) => file.endsWith(".yml") && !file.startsWith("."),
  )) {
    const video = parse(
      readFileSync(`${root}/content/09.videos/${file}`, "utf8"),
    );
    const slug = file.replace(/\.yml$/, "");
    slugs.add(slug);
    assert.match(video.youtubeId, /^[A-Za-z0-9_-]{11}$/);
    assert.ok(existsSync(`${root}/public${video.image.src}`));
    assert.equal(typeof video.visible, "boolean");
    assert.ok(Array.isArray(video.categories));
    assert.ok(preview[`content/09.videos/${file}`].includes("/videos"));
    for (const page of pages.filter((page) =>
      page.body.includes(`video="${slug}"`),
    ))
      assert.ok(preview[`content/09.videos/${file}`].includes(page.path));
  }
  for (const page of pages) {
    for (const match of page.body.matchAll(/video-player\{video="([^"]+)"/g))
      assert.ok(slugs.has(match[1]), `${page.file}: ${match[1]}`);
    assert.doesNotMatch(page.body, /\]\(https:\/\/(?:www\.)?youtube\.com\//);
  }
});

test("service URLs are nested under book-a-session and old URLs redirect directly", () => {
  const offers = pages.filter((page) => page.collection === "offers");
  assert.ok(offers.length >= 7);
  for (const offer of offers) {
    assert.ok(offer.path.startsWith("/book-a-session/"), offer.path);
    assert.equal(
      redirects[offer.path.replace("/book-a-session/", "/services/")],
      offer.path,
    );
    for (const [oldPath, destination] of Object.entries(redirects)) {
      if (destination !== offer.path) continue;
      for (const page of pages) {
        assert.ok(!page.body.includes(`](${oldPath})`), page.file);
      }
    }
  }
});

test("consultations have complete scopes and valid provider booking destinations", () => {
  const offers = pages.filter((page) => page.data.kind === "consultation");
  assert.ok(offers.length >= 6);
  for (const offer of offers) {
    assert.ok(
      Number.isFinite(offer.data.price) && offer.data.price > 0,
      offer.file,
    );
    const booking = new URL(offer.data.bookingUrl);
    assert.equal(booking.protocol, "https:");
    assert.equal(booking.hostname, "link.funnelstreams.com");
    for (const field of ["duration", "bestFor", "summary"])
      assert.ok(offer.data[field]?.trim(), `${offer.file}: ${field}`);
    assert.doesNotMatch(
      offer.body,
      /^# /m,
      `${offer.file}: the detail layout supplies its heading`,
    );
    assert.doesNotMatch(
      offer.body,
      /\$[\d,]+/,
      `${offer.file}: prices belong in the shared summary`,
    );
  }
  assert.ok(offers.some((offer) => offer.data.featured));
  for (const path of ["/", "/book-a-session"]) {
    const page = pages.find((page) => page.path === path);
    assert.ok(page.data.sessions, path);
    assert.doesNotMatch(
      page.body,
      /provider-embed/,
      `${path}: keep booking selection focused`,
    );
  }
});

// These checks cover the editing contract: every section tab must own its copy and fields.
test("Studio sections have unique slots, editable fields and valid media and actions", () => {
  for (const page of pages) {
    if (page.collection === "content") continue;
    const blocks = page.data.studio?.blocks;
    assert.ok(blocks?.length, page.file);
    assert.equal(
      new Set(blocks.map((b) => b.id)).size,
      blocks.length,
      page.file,
    );
    assert.equal(
      (page.body.match(/^::page-sections$/gm) || []).length,
      1,
      page.file,
    );
    assert.doesNotMatch(page.body, /^:{2,}(?!page-sections)[a-z]/m, page.file);
    for (const block of blocks) {
      assert.ok(page.data[block.field], `${page.file}: ${block.field}`);
      assert.equal(block.component, "page-sections");
      assert.equal(
        (page.body.match(new RegExp(`^#${block.slot}$`, "gm")) || []).length,
        1,
        page.file,
      );
      const section = page.data[block.field];
      for (const image of [section.image, ...(section.images || [])].filter(
        Boolean,
      )) {
        assert.ok(
          existsSync(`${root}/public${image.src}`),
          `${page.file}: ${image.src}`,
        );
        assert.equal(typeof image.alt, "string");
      }
      for (const link of [
        ...(section.actions || []),
        ...(section.links || []),
        section.image,
        ...(section.images || []),
      ].filter((item) => item?.to)) {
        if (link.to.startsWith("/"))
          assert.ok(
            known.has(link.to.split(/[?#]/)[0]) || redirects[link.to],
            `${page.file}: ${link.to}`,
          );
      }
      if (section.form) {
        assert.equal(new URL(section.form.src).protocol, "https:");
        assert.ok(section.form.title);
      }
      if (section.video)
        assert.ok(existsSync(`${root}/content/09.videos/${section.video}.yml`));
    }
  }
});

test("menu routes match their labels and content links use canonical routes", () => {
  const menu = parse(
    readFileSync(`${root}/content/08.settings/menu.yml`, "utf8"),
  );
  const expected = {
    "How I can help": "/how-can-help",
    "Meet Staci": "/meet-staci",
    Speaking: "/speaking",
    Contact: "/contact",
    "Book a session": "/book-a-session",
  };
  for (const item of [...menu.items, menu.action])
    assert.equal(item.to, expected[item.label]);
  for (const page of pages) {
    const check = (value) => {
      if (!value || typeof value !== "object") return;
      if (typeof value.to === "string" && value.to.startsWith("/"))
        assert.ok(
          !redirects[value.to.split(/[?#]/)[0]],
          `${page.file}: obsolete ${value.to}`,
        );
      for (const child of Object.values(value)) check(child);
    };
    check(page.data);
    for (const match of page.body.matchAll(/\]\(<?(\/[^)>\s]+)/g))
      assert.ok(
        !redirects[match[1].split(/[?#]/)[0]],
        `${page.file}: obsolete ${match[1]}`,
      );
  }
});

// Main pages must stay readable in Studio's ordinary visual Markdown editor.
test("six main pages share Pages with simple Details and plain Markdown stories", () => {
  const main = pages.filter((page) => page.collection === "content");
  assert.deepEqual(
    main.map((page) => page.path).sort(),
    [
      "/",
      "/how-can-help",
      "/meet-staci",
      "/speaking",
      "/contact",
      "/book-a-session",
    ].sort(),
  );
  for (const page of main) {
    for (const field of [
      "eyebrow",
      "title",
      "description",
      "cta",
      "secondaryCta",
    ])
      assert.ok(page.data[field], `${page.file}: ${field}`);
    assert.doesNotMatch(page.body, /^:{2,}|^#[a-z]/m, page.file);
    const blocks = page.data.studio?.blocks || [];
    assert.ok(blocks.length <= 1, page.file);
    for (const block of blocks) {
      assert.equal(block.type, "fields");
      assert.ok(page.data[block.field], page.file);
    }
  }
});

test("Studio media pickers have configured image and video libraries", () => {
  const navigation = parse(
    readFileSync(`${root}/content/.navigation.yml`, "utf8"),
  );
  for (const [kind, collection] of [
    ["images", "photos"],
    ["videos", "videos"],
  ]) {
    const directory = navigation.studio?.libraries?.[kind];
    assert.equal(typeof directory, "string", `${kind}: library configuration`);
    assert.ok(
      existsSync(`${root}/content/${directory}/.navigation.yml`),
      `${kind}: library folder`,
    );
    const settings = parse(
      readFileSync(`${root}/content/${directory}/.navigation.yml`, "utf8"),
    );
    assert.equal(settings.studio.view, "media", `${kind}: media view`);
    assert.ok(
      readdirSync(`${root}/content/${directory}`).some(
        (file) => file.endsWith(".yml") && !file.startsWith("."),
      ),
      `${collection}: library items`,
    );
  }
});
