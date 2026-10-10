// Nuxt Content stores Markdown images as compact AST nodes after parsing.
function storyImage(body) {
  if (typeof body === "string") {
    const match = body.match(/!\[([^\]]*)\]\(<?([^\s)>]+)>?(?:\s+[^)]*)?\)/);
    return match ? { src: match[2], alt: match[1] } : undefined;
  }
  if (!body || typeof body !== "object") return;
  if (Array.isArray(body)) {
    if (["img", "nuxt-img", "NuxtImg"].includes(body[0]) && body[1]?.src)
      return { src: body[1].src, alt: body[1].alt || "" };
    for (const child of body) {
      const found = storyImage(child);
      if (found) return found;
    }
  } else {
    for (const child of Object.values(body)) {
      const found = storyImage(child);
      if (found) return found;
    }
  }
}

export function sharingImage(page, site, photos = [], videos = []) {
  const origin = site?.url || "https://theoper8tor.marpos.nl";
  const pageImage = page?.image || storyImage(page?.body);
  const photo = photos.find((item) => item.image?.src === pageImage?.src);
  const video = videos.find((item) => item.youtubeId === page?.youtubeId);
  const candidates = [
    page?.thumbnail,
    photo?.thumbnail,
    pageImage,
    video?.thumbnail,
    video?.image,
    site?.sharingImage,
    site?.logo,
    { src: "/images/41b657dea49b.jpeg", alt: "The Oper8tor" },
  ];
  for (const image of candidates) {
    if (!image?.src?.trim()) continue;
    try {
      const url = new URL(image.src, origin);
      if (!["https:", "http:"].includes(url.protocol)) continue;
      return {
        src: url.href,
        alt: image.alt || page?.title || site?.name || "The Oper8tor",
      };
    } catch {
      // An invalid optional image must not prevent the default from being used.
    }
  }
}
