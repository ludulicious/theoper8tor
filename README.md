# The Oper8tor

Nuxt 4 + Nuxt Content 3 migration of https://theoper8tor.com/, extracted on 10 October 2026. Follows the vdzmediation project: typed content collections, numbered Markdown files, a Studio media library, separate menu/site settings, automatic page previews and sitemap, static generation and Docker deployment.

```sh
pnpm install
pnpm dev
pnpm typecheck
pnpm test
pnpm generate
```

Preview: http://localhost:3109. Static output: `.output/public`. For a Node server, run `pnpm build` and `node .output/server/index.mjs`. The pnpm version is pinned in package.json. Stop the development server before running typecheck or a production build, because Nuxt prepare regenerates the development manifest.

The 31 editable pages include the main site, service details, Ready to Scale programme and booking pages, the current Connect page, planner and AI pages, newsletter, legal information and four blog articles. Original black/gold branding, local Oswald/Open Sans fonts, photographs and source copy are retained. Long text previously styled as headings is normal body copy. Source exports are archived in `docs/source/`; ongoing edits belong in `content/`.

See [Marpos Studio editing guide](docs/marpos-studio.md) and [migration notes](docs/migration.md), including known source issues to review before launching. Marpos Studio's project inspector recognises 13 editable collections without warnings.

Forms and calendars load directly in iframes from their original external providers. Video and Spotify load when a visitor opens them. Planner checkout opens the original provider-hosted funnel. No purchases or form submissions were performed during migration. Availability and delivery remain the provider's responsibility.

## Deployment

Static hosting: run `pnpm generate`, publish `.output/public`, and configure the redirects from `public/_redirects` (Netlify/Cloudflare Pages format). Other hosts must install equivalent redirects. Node hosting uses Nuxt route rules for these redirects.

```sh
docker build -t theoper8tor .
docker run -d --name theoper8tor --restart unless-stopped -p 3000:3000 theoper8tor
```

Docker follows vdzmediation: Node 22, native SQLite built on the target platform, a separate build stage and a non-root runtime. The Docker image was prepared but not built during this migration. Put your HTTPS reverse proxy in front of port 3000. Rebuild after publishing content changes.

The folder is ready to place in its own GitHub repository and connect to Marpos Studio. No repository, hosting or production domain has been changed.
