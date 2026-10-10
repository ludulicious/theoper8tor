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
    for (const field of ["duration", "bestFor", "description"])
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

test("supporting pages use plain Markdown and keep forms outside the story", () => {
  const supporting = pages.filter((page) =>
    ["booking", "information"].includes(page.collection),
  );
  assert.equal(supporting.filter((page) => page.data.form).length, 7);
  for (const page of supporting) {
    assert.equal(page.data.studio, undefined, page.file);
    assert.doesNotMatch(page.body, /^:{2,}|^#[a-z]|^# /m, page.file);
    if (page.data.form) {
      assert.equal(
        new URL(page.data.form.url).hostname,
        "link.funnelstreams.com",
      );
      assert.ok(page.data.form.title, page.file);
      assert.doesNotMatch(page.body, /provider-embed|<iframe/, page.file);
    }
  }
  assert.equal(
    pages.find((page) => page.path === "/videos").data.videoLibrary,
    true,
  );
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

test("offers have plain Markdown stories and one source for their summaries", () => {
  for (const offer of pages.filter((page) => page.collection === "offers")) {
    assert.equal(offer.data.studio, undefined, offer.file);
    assert.equal(offer.data.summary, undefined, offer.file);
    assert.ok(offer.body.trim(), offer.file);
    assert.doesNotMatch(offer.body, /^:{2,}|^#[a-z]|^# /m, offer.file);
    if (offer.data.youtubeId)
      assert.match(offer.data.youtubeId, /^[A-Za-z0-9_-]{11}$/);
  }
});

test("blog stories use ordinary Markdown without section tabs or duplicate titles", () => {
  for (const page of pages.filter((page) =>
    ["blogIndex", "blog"].includes(page.collection),
  )) {
    assert.equal(page.data.studio, undefined, page.file);
    assert.doesNotMatch(page.body, /^:{2,}|^#[a-z]|^# /m, page.file);
    if (page.collection === "blog") assert.ok(page.body.trim(), page.file);
  }
});

test("sharing previews prefer thumbnails, keep page images and always have a default", async () => {
  const { sharingImage } = await import("../shared/sharing-image.mjs");
  const site = {
    url: "https://theoper8tor.com",
    sharingImage: { src: "/images/default.jpg", alt: "Default" },
  };
  const image = { src: "/images/page.jpg", alt: "Page" };
  const thumbnail = { src: "/images/thumb.jpg", alt: "Thumbnail" };
  const photos = [{ image, thumbnail }];
  assert.equal(
    sharingImage(
      { image, thumbnail: { src: "/images/override.jpg" } },
      site,
      photos,
    ).src,
    "https://theoper8tor.com/images/override.jpg",
  );
  assert.equal(
    sharingImage({ image }, site, photos).src,
    "https://theoper8tor.com/images/thumb.jpg",
  );
  assert.equal(sharingImage({ image }, site).alt, "Page");
  assert.equal(
    sharingImage(
      { body: { type: "root", value: [["p", {}, ["img", image]]] } },
      site,
      photos,
    ).src,
    "https://theoper8tor.com/images/thumb.jpg",
  );
  assert.equal(
    sharingImage(
      { youtubeId: "49rddBl7nwI" },
      site,
      [],
      [{ youtubeId: "49rddBl7nwI", image }],
    ).src,
    "https://theoper8tor.com/images/page.jpg",
  );
  assert.equal(
    sharingImage({ thumbnail: { src: "javascript:invalid" } }, site).src,
    "https://theoper8tor.com/images/default.jpg",
  );
  const settings = parse(
    readFileSync(`${root}/content/08.settings/site.yml`, "utf8"),
  );
  const library = (directory) =>
    readdirSync(`${root}/content/${directory}`)
      .filter((file) => file.endsWith(".yml") && !file.startsWith("."))
      .map((file) =>
        parse(readFileSync(`${root}/content/${directory}/${file}`, "utf8")),
      );
  for (const page of pages) {
    const selected = sharingImage(
      { ...page.data, body: page.body },
      settings,
      library("07.photos"),
      library("09.videos"),
    );
    const url = new URL(selected.src);
    assert.equal(url.protocol, "https:", page.file);
    assert.ok(selected.alt, page.file);
    if (url.origin === settings.url)
      assert.ok(
        existsSync(`${root}/public${url.pathname}`),
        `${page.file}: ${url.pathname}`,
      );
  }
});
