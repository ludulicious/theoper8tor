# Maintaining The Oper8tor in Marpos Studio

The editing contract follows vdzmediation. There is no Nuxt Studio login. Content is stored in Markdown and YAML; the website design lives separately in Vue components and CSS.

## Connect the project

Put this project, including `content.config.ts`, `content/`, `public/`, `pnpm-lock.yaml` and `studio.preview.json`, in its own GitHub repository. Select that repository and project folder in Marpos Studio. Let Studio install dependencies and start `pnpm dev`. Review edits in Preview this page, save them, and publish through Studio's normal review flow. Your hosting must rebuild the website after publication.

The project is connected to `ludulicious/theoper8tor` on GitHub. Hosting must still be configured separately.

## Where to edit

| Collection  | Location                                          | Purpose                                                                |
| ----------- | ------------------------------------------------- | ---------------------------------------------------------------------- |
| Home        | `content/00.index.md`                             | Homepage story and calls to action                                     |
| Speaker     | `content/01.speaker.md`                           | Speaking, interviewing and training                                    |
| Services    | `content/02.services/00.index.md`                 | Services overview                                                      |
| Offers      | `content/02.services/*.md` excluding the overview | Consultations and programmes                                           |
| Booking     | `content/03.booking/`                             | Booking list and calendar pages                                        |
| Contact     | `content/04.contact.md`                           | Contact introduction and form                                          |
| Information | `content/05.information/`                         | Shop, Connect, schedule, disclaimer, About, planner, AI and newsletter |
| Blog Index  | `content/06.blog/00.index.md`                     | Blog introduction                                                      |
| Blog        | `content/06.blog/` excluding the overview         | Articles, automatically listed on Blog                                 |
| Photos      | `content/07.photos/`                              | Image library                                                          |
| Videos      | `content/09.videos/`                              | YouTube library with categories, thumbnails and visibility             |
| Menu / Site | `content/08.settings/`                            | Navigation, logo, contact details and footer                           |

Each page has Title, Description and optional SEO Title. Optional Breadcrumbs let you set an ordered trail of labels and links; leave the final item without a link. If omitted, the page uses Home and its title; offers include Book Now between them. Layout is filled by the collection and hidden from ordinary editing. Article images use the media picker and can be selected in the Photos library. Menu links and footer links are independently editable lists. Site URL controls canonical addresses and the sitemap. Header Logo and Footer Logo select separate transparent PNG wordmarks suited to the dark header and footer, with gold lettering and ivory accents. The original Logo stays available for social sharing and as a fallback.

## Stories and reusable sections

Use the visual story editor for paragraphs, headings, lists, links and photographs. Source mode exposes the Markdown components:

- `::site-section` groups a section. Its children are normal Markdown.
- `::content-grid{columns="2"}` groups two or three columns. Each `::content-panel` holds ordinary story content.
- `::action-link{label="Book now" to="/book-online"}` provides a button link.
- `::provider-embed{src="https://link.funnelstreams.com/widget/form/..." title="Contact"}` embeds an existing provider form or calendar directly on the page. Use `::video-player{video="security-cameras"}` for a library video.

Nested components use progressively longer colon fences; preserve the matching opening and closing fences when editing source mode. Keep one level-one heading per page. Use smaller headings for sections, and paragraphs for descriptions and prices.

Forms and calendars remain hosted by the original providers. Change their URLs in the relevant story when changing providers; the ProviderEmbed allowlist must also be updated by a developer for a different host. Forms and calendars load directly in iframes, with a new-tab fallback link below each embed. Provider form labels, consent text, notifications and payment products are maintained in that provider, not in Studio.

## New content and ordering

Choose Add content in Offers, Booking, Information or Blog. The filename determines the public address; no route field is required. Numeric prefixes determine editor ordering and are removed from public URLs. For example:

- `content/02.services/08.new-consultation.md` → `/book-online/new-consultation`
- `content/05.information/08.new-page.md` → `/new-page`
- `content/06.blog/05.new-story.md` → `/blog/b/new-story`

Do not reuse a filename slug already present in another collection. Renaming a slug changes its URL; add a redirect in `shared/legacy-redirects.json`. Reordering only the number does not change the URL. Add new navigation links to Menu if they should appear in the header. Blog posts appear automatically. The next start/build updates the sitemap and `studio.preview.json`, including media usage destinations.

## Photos

The library supports category and visibility filters, uploads to `public/images/`, editable alternative text and optional thumbnails. Images retain their natural proportions; library thumbnails use 4:3. Supported uploads are JPG, JPEG, PNG, WebP and GIF up to 10 MiB. The original SVG social icons remain project assets and do not need editing for ordinary page maintenance.

`visible` controls library metadata; pages display their selected image directly. To remove a photograph from a page, remove or replace the page's image. Updating a library item's source does not rewrite existing inline Markdown image paths: select the new image on each page that uses it.

## Videos

The Videos collection follows the Amstel Gospel Choir media library: add a title, an 11-character YouTube ID (the value after `v=` or `youtu.be/`), thumbnail with alternative text, categories and order. Lower order values appear first. Switch Visible off to hide a video both in the gallery and on pages that reference it. Thumbnails can be chosen from Photos.

All visible videos appear automatically at `/videos`; category filters are built from their categories. The page introduction is editable in Information → Videos. Each thumbnail opens an embedded YouTube player on the website, with fullscreen support; YouTube loads only after Play is clicked. Selecting another gallery video stops the previous one.

To insert a library video into another page, use `::video-player{video="security-cameras"}` in source mode, with the filename without `.yml` as the video value. Keep the matching closing `::` fence. Updating a library entry updates all its players. Rename its filename only if you also update page references. `::video-gallery` inserts the complete library.

The original Uncle Nearest video is unavailable on YouTube. Its entry and ID are retained with Visible off, and the site logo is its fallback thumbnail. Replace the ID and thumbnail, then switch Visible on to restore it to the gallery and homepage.

## Preview and publication

`studio.preview.json` maps pages to their own addresses, settings to Home, images to the pages where they are used, and videos to the gallery and pages that reference them. New documents are discovered from their collection source and filename. This file controls previews only; it does not create routes.

Before launch, read `docs/migration.md` for the original site's conflicting prices, historical events, unrelated About template and missing external destinations. Publishing in Studio edits GitHub content; configure hosting to rebuild and publish the generated result afterward.

Offer pages use `/book-online/[offer]`, including `/book-online/initial-consultation` and `/book-online/fastaction`. The previous root URLs redirect permanently to their new addresses. Studio previews and the sitemap use the nested URLs.

## Consultation summaries and the sales journey

Home and Book a Session use the same offer data. Services explains the areas of support and the working process; it links to Book a Session for the comparison of packages, prices and durations. Edit a consultation once in **Offers** to update its listing everywhere:

- **Kind:** `consultation` includes it in session lists; `programme` keeps it separate.
- **Price:** a number in USD, without a currency symbol or comma. The site formats it consistently.
- **Duration:** the session length and any included follow-up time.
- **Best For:** the visitor's need, shown above the session name.
- **Summary:** a short explanation of the session's focus.
- **Booking URL:** the existing provider's booking address for that session.
- **Featured:** shows the session among the homepage starting points.
- **Order:** smaller numbers appear first.

The consultation detail layout supplies the title, summary, duration, price and booking button. Its story body should start with level-two headings, and explain scope and deliverables without repeating prices or adding another booking button. Programme pages retain their ordinary story layout. `sales` selects the shared sales styling and is hidden from ordinary editing.

`::offer-list` inserts all consultations as pricing cards with the session name, price, duration, summary and a link to the full scope and booking action. `::offer-list{featured="true"}` inserts only featured consultations. `::story-hero{image="/images/86cafeac5a88.jpg" alt="Staci Moore" eyebrow="Meet The Oper8tor"}` places editable Markdown beside a photograph. As with other components, preserve the closing colon fence.

The main menu sends visitors to How I can help (Services), Meet Staci, Speaking and Contact, with **Book a session** as the primary action. Resources retains `/shop` so existing links work. Videos, blog and newsletter remain in the footer. VIP Day pricing is enquiry only. Existing forms and calendars remain with their provider.

Use `::photo-story{image="/images/9c2d4e9ea8d5.jpg" alt="Staci Moore in yellow"}` for a photograph beside a story section. The photograph sits on the left on larger screens and above the story on phones. Its paragraphs, headings and links are ordinary editable Markdown. Change the image path and alternative text in the component attributes to choose another photograph from the library.

### Editable image formats

All images in `public/images/` use JPEG or PNG so they can be edited in Marpos Studio. Opaque photographs use high-quality JPEG; transparent images and logos use PNG. Photo dimensions are preserved, and vector artwork was exported at four times its original dimensions for sharp display. Original vector sources are retained in `docs/vector-originals/`; the favicon remains an SVG.

Website images render through `NuxtImg` with responsive source sets and 1×/2× variants. Heroes, photo stories, content grids, article images, blog cards, video thumbnails and logos use sizes for their respective layouts. Markdown images automatically use the shared `ProseImg` renderer; no content syntax changes are needed. An optional `sizes` attribute overrides the default for an individual Markdown image. Hero images load eagerly; images further down the page load lazily. Static generation includes the resized image files.
