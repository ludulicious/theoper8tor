import { defineCollection, defineContentConfig, z } from "@nuxt/content";
import { pageSources } from "./shared/content-sources.mjs";
const image = z.object({
  src: z.string().editor({ input: "media" }),
  alt: z.string(),
});
const link = z.object({ label: z.string(), to: z.string() });
const page = z.object({
  thumbnail: image.optional(),
  title: z.string().min(1),
  description: z.string(),
  seoTitle: z.string().optional().editor({ hidden: true }),
  seoDescription: z.string().optional().editor({ hidden: true }),
  pageName: z.string().optional().editor({ hidden: true }),
  sales: z.boolean().default(false).editor({ hidden: true }),
  breadcrumbs: z
    .array(
      z.object({
        label: z.string().min(1),
        to: z.string().optional(),
      }),
    )
    .optional()
    .editor({ hidden: true }),
});
const story = z.literal("story").default("story").editor({ hidden: true });
const documentPage = page.extend({
  layout: story,
  image: image.optional(),
  form: z
    .object({
      url: z.string().url(),
      title: z.string(),
    })
    .optional(),
  videoLibrary: z.boolean().optional().editor({ hidden: true }),
});
export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: "page",
      source: pageSources.content,
      schema: z.object({
        eyebrow: z.string(),
        title: z.string().min(1),
        description: z.string(),
        cta: link,
        secondaryCta: link,
        image: image.optional(),
        thumbnail: image.optional(),
        pageName: z.string().optional().editor({ hidden: true }),
        seoTitle: z.string().optional().editor({ hidden: true }),
        seoDescription: z.string().optional().editor({ hidden: true }),
        breadcrumbs: z
          .array(z.object({ label: z.string(), to: z.string().optional() }))
          .optional()
          .editor({ hidden: true }),
        layout: z.literal("main").default("main").editor({ hidden: true }),
        sales: z.boolean().default(true).editor({ hidden: true }),
        imagePosition: z.string().optional().editor({ hidden: true }),
        mobileImagePosition: z.string().optional().editor({ hidden: true }),
        sessions: z
          .object({
            title: z.string(),
            description: z.string(),
            featuredOnly: z.boolean().default(false),
            cta: link.optional(),
          })
          .optional()
          .editor({ hidden: true }),
        contactForm: z
          .object({
            src: z.string().url(),
            title: z.string(),
            kind: z.string().optional().editor({ hidden: true }),
          })
          .optional()
          .editor({ hidden: true }),
        studio: z
          .object({
            blocks: z.array(
              z.object({
                id: z.string(),
                label: z.string(),
                type: z.literal("fields"),
                field: z.string(),
              }),
            ),
          })
          .optional()
          .editor({ hidden: true }),
      }),
    }),
    offers: defineCollection({
      type: "page",
      source: pageSources.offers,
      schema: page.extend({
        breadcrumbs: page.shape.breadcrumbs.editor({ hidden: true }),
        layout: story,
        kind: z.enum(["consultation", "programme"]).default("programme"),
        price: z.number().positive().optional(),
        duration: z.string().optional(),
        bestFor: z.string().optional(),
        bookingUrl: z.string().optional(),
        bookingLabel: z.string().optional(),
        youtubeId: z
          .string()
          .regex(/^[A-Za-z0-9_-]{11}$/)
          .optional(),
        featured: z.boolean().default(false),
        order: z.number().nonnegative().default(0),
      }),
    }),
    booking: defineCollection({
      type: "page",
      source: pageSources.booking,
      schema: documentPage,
    }),
    information: defineCollection({
      type: "page",
      source: pageSources.information,
      schema: documentPage,
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
        sharingImage: image.optional(),
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
