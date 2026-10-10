import { defineCollection, defineContentConfig, z } from "@nuxt/content";
import { pageSources } from "./shared/content-sources.mjs";
const image = z.object({
  src: z.string().editor({ input: "media" }),
  alt: z.string(),
});
const link = z.object({ label: z.string(), to: z.string() });
const page = z.object({
  title: z.string().min(1),
  description: z.string(),
  seoTitle: z.string().optional(),
  breadcrumbs: z
    .array(
      z.object({
        label: z.string().min(1),
        to: z.string().optional(),
      }),
    )
    .optional(),
});
const story = z.literal("story").default("story").editor({ hidden: true });
export default defineContentConfig({
  collections: {
    home: defineCollection({
      type: "page",
      source: pageSources.home,
      schema: page.extend({ layout: story }),
    }),
    speaker: defineCollection({
      type: "page",
      source: pageSources.speaker,
      schema: page.extend({ layout: story }),
    }),
    services: defineCollection({
      type: "page",
      source: pageSources.services,
      schema: page.extend({ layout: story }),
    }),
    offers: defineCollection({
      type: "page",
      source: pageSources.offers,
      schema: page.extend({ layout: story }),
    }),
    booking: defineCollection({
      type: "page",
      source: pageSources.booking,
      schema: page.extend({ layout: story }),
    }),
    contact: defineCollection({
      type: "page",
      source: pageSources.contact,
      schema: page.extend({ layout: story }),
    }),
    information: defineCollection({
      type: "page",
      source: pageSources.information,
      schema: page.extend({ layout: story }),
    }),
    blogIndex: defineCollection({
      type: "page",
      source: pageSources.blogIndex,
      schema: page.extend({
        layout: z.literal("blog").default("blog").editor({ hidden: true }),
      }),
    }),
    blog: defineCollection({
      type: "page",
      source: pageSources.blog,
      schema: page.extend({
        layout: z
          .literal("article")
          .default("article")
          .editor({ hidden: true }),
        image: image.optional(),
        author: z.string().optional(),
        date: z.string().optional(),
      }),
    }),
    photos: defineCollection({
      type: "data",
      source: { include: "07.photos/*.yml", exclude: ["**/.navigation.yml"] },
      schema: z.object({
        title: z.string(),
        visible: z.boolean().default(true),
        order: z.number().nonnegative().default(0),
        image,
        thumbnail: image.optional(),
        categories: z.array(z.string()).default([]),
        credit: z.string().optional(),
      }),
    }),
    videos: defineCollection({
      type: "data",
      source: { include: "09.videos/*.yml", exclude: ["**/.navigation.yml"] },
      schema: z.object({
        title: z.string().min(1),
        youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
        image,
        visible: z.boolean().default(true),
        order: z.number().nonnegative().default(0),
        categories: z.array(z.string().trim().min(1)).default([]),
      }),
    }),
    menu: defineCollection({
      type: "data",
      source: "08.settings/menu.yml",
      schema: z.object({
        title: z.string(),
        items: z.array(link),
        action: link,
        openLabel: z.string(),
        closeLabel: z.string(),
      }),
    }),
    site: defineCollection({
      type: "data",
      source: "08.settings/site.yml",
      schema: z.object({
        title: z.string(),
        name: z.string(),
        url: z.string().url(),
        logo: image,
        headerLogo: image.optional(),
        footerLogo: image.optional(),
        phone: z.string(),
        phoneLink: z.string(),
        email: z.string(),
        copyright: z.string(),
        skipLink: z.string(),
        footerLinks: z.array(link),
        socialLinks: z.array(link),
        readMore: z.string(),
        backLabel: z.string(),
      }),
    }),
  },
});
