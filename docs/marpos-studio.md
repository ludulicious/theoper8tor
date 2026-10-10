# Maintaining The Oper8tor in Marpos Studio

The editing contract follows vdzmediation. There is no Nuxt Studio login. Content is stored in Markdown and YAML; the website design lives separately in Vue components and CSS.

## Connect the project

Put this project, including `content.config.ts`, `content/`, `public/`, `pnpm-lock.yaml` and `studio.preview.json`, in its own GitHub repository. Select that repository and project folder in Marpos Studio. Let Studio install dependencies and start `pnpm dev`. Review edits in Preview this page, save them, and publish through Studio's normal review flow. Your hosting must rebuild the website after publication.

The project is connected to `ludulicious/theoper8tor` on GitHub. Hosting must still be configured separately.

## Where to edit

| Collection  | Location                                          | Purpose                                                                |
| ----------- | ------------------------------------------------- | ---------------------------------------------------------------------- |
| Home        | `content/00.index.md`                             | Homepage sections and calls to action                                     |
| Speaker     | `content/01.speaking.md`                           | Speaking, interviewing and training                                    |
| Services    | `content/02.how-can-help.md`                 | Services overview                                                      |
| Offers      | `content/02.services/*.md` excluding the overview | Consultations and programmes                                           |
| Booking     | `content/03.booking/`                             | Booking list and calendar pages                                        |
| Contact     | `content/04.contact.md`                           | Contact introduction and form                                          |
| Information | `content/05.information/`                         | Shop, Connect, schedule, disclaimer, About, planner, AI and newsletter |
| Blog Index  | `content/06.blog/00.index.md`                     | Blog introduction                                                      |
| Blog        | `content/06.blog/` excluding the overview         | Articles, automatically listed on Blog                                 |
| Photos      | `content/07.photos/`                              | Image library                                                          |
| Videos      | `content/09.videos/`                              | YouTube library with categories, thumbnails and visibility             |
| Menu / Site | `content/08.settings/`                            | Navigation, logo, contact details and footer                           |

Each page has Title, Description and optional SEO Title. Optional Breadcrumbs let you set an ordered trail of labels and links; leave the final item without a link. If omitted, the page uses Home and its title; offers include Book a session between them. Layout is filled by the collection and hidden from ordinary editing. Article images use the media picker and can be selected in the Photos library. Menu links and footer links are independently editable lists. Site URL controls canonical addresses and the sitemap. Header Logo and Footer Logo select separate transparent PNG wordmarks suited to the dark header and footer, with gold lettering and ivory accents. The original Logo stays available for social sharing and as a fallback.

## Named page sections

Pages follow the Amstel Gospel Choir homepage editing pattern: choose a named section tab, such as **Introduction**, **Where are you right now?**, or **What is included**. Each tab contains its own Title, Eyebrow, Image (with the media picker and alternative text), Actions, Links and Visible switch where applicable. Edit the paragraphs and lists in the visual text editor directly below those fields. There is no need to find or edit nested components.

The **Details** tab contains the page title, search description, breadcrumbs and any collection-specific settings. Section settings are kept out of Details. Session pages keep Price, Duration, Summary, Best For, Booking URL, Featured and Order in Details, so listing cards and the booking summary continue to share one source.

Forms have an editable source URL and title in their section. Session comparison sections have a Featured Only switch. Video sections reference the Videos library. These render automatically; the text editor contains ordinary Markdown only.

All pages use one `::page-sections` container, with one named Markdown slot per section. The hidden `studio.blocks` configuration maps each tab to its slot and section fields. Preserve that mapping in source mode. The reusable `PageSections.vue` renderer handles the layout; text, images and actions live in the content file. New section field names must also be added to the collection in `shared/section-fields.mjs` by a developer.

## New content and ordering

For a new page with named sections, start from a similar existing content file so its section fields, Studio tabs and text slots stay connected. A developer can add or rename section types in `shared/section-fields.mjs`. Choose Add content in Offers, Booking, Information or Blog for the new document. The filename determines the public address; no route field is required. Numeric prefixes determine editor ordering and are removed from public URLs. For example:

- `content/02.services/08.new-consultation.md` → `/book-a-session/new-consultation`
- `content/05.information/08.new-page.md` → `/new-page`
- `content/06.blog/05.new-story.md` → `/blog/new-story`

Do not reuse a filename slug already present in another collection. Renaming a slug changes its URL; add a redirect in `shared/legacy-redirects.json`. Reordering only the number does not change the URL. Add new navigation links to Menu if they should appear in the header. Blog posts appear automatically. The next start/build updates the sitemap and `studio.preview.json`, including media usage destinations.

## Photos

The library supports category and visibility filters, uploads to `public/images/`, editable alternative text and optional thumbnails. Images retain their natural proportions; library thumbnails use 4:3. Supported uploads are JPG, JPEG, PNG, WebP and GIF up to 10 MiB. The library uses editable JPEG/PNG images; original SVG artwork is archived under `docs/vector-originals/`.

`visible` controls library metadata; pages display their selected image directly. To remove a photograph from a page, remove or replace the page's image. Updating a library item's source does not rewrite selected image paths in page sections: select the new image in each section that uses it.

## Videos

The Videos collection follows the Amstel Gospel Choir media library: add a title, an 11-character YouTube ID (the value after `v=` or `youtu.be/`), thumbnail with alternative text, categories and order. Lower order values appear first. Switch Visible off to hide a video both in the gallery and on pages that reference it. Thumbnails can be chosen from Photos.

All visible videos appear automatically at `/videos`; category filters are built from their categories. The page introduction is editable in Information → Videos. Each thumbnail opens an embedded YouTube player on the website, with fullscreen support; YouTube loads only after Play is clicked. Selecting another gallery video stops the previous one.

To select a library video in a page section, set its **Video** field to the filename without `.yml`, for example `security-cameras`. **Video Library** displays the complete gallery. Updating a library entry updates all its players. Rename its filename only if you also update the section references.

The original Uncle Nearest video is unavailable on YouTube. Its entry and ID are retained with Visible off, and the site logo is its fallback thumbnail. Replace the ID and thumbnail, then switch Visible on to restore it to the gallery and homepage.

## Preview and publication

`studio.preview.json` maps pages to their own addresses, settings to Home, images to the pages where they are used, and videos to the gallery and pages that reference them. New documents are discovered from their collection source and filename. This file controls previews only; it does not create routes.

Before launch, read `docs/migration.md` for the original site's conflicting prices, historical events, unrelated About template and missing external destinations. Publishing in Studio edits GitHub content; configure hosting to rebuild and publish the generated result afterward.

Offer pages use `/book-a-session/[slug]`, including `/book-a-session/initial-consultation` and `/book-a-session/fast-action`. The previous root URLs redirect permanently to their new addresses. Studio previews and the sitemap use the nested URLs.

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

The consultation detail layout supplies the title, summary, duration, price and booking button. Its named sections explain scope and deliverables without repeating prices or adding another booking button. Programme pages use the same section editor. `sales` selects the shared sales styling and is hidden from ordinary editing.

The main menu sends visitors to How I can help (Services), Meet Staci, Speaking and Contact, with **Book a session** as the primary action. Resources uses `/resources`; old `/shop` links redirect to it. Videos, blog and newsletter remain in the footer. VIP Day pricing is enquiry only. Existing forms and calendars remain with their provider.

### Editable image formats

All images in `public/images/` use JPEG or PNG so they can be edited in Marpos Studio. Opaque photographs use high-quality JPEG; transparent images and logos use PNG. Photo dimensions are preserved, and vector artwork was exported at four times its original dimensions for sharp display. Original vector sources are retained in `docs/vector-originals/`; the favicon remains an SVG.

Website images render through `NuxtImg` with responsive source sets and 1×/2× variants. Hero sections, photo sections, article images, blog cards, video thumbnails and logos use sizes for their respective layouts. Markdown images automatically use the shared `ProseImg` renderer; no content syntax changes are needed. An optional `sizes` attribute overrides the default for an individual Markdown image. Hero images load eagerly; images further down the page load lazily. Static generation includes the resized image files.

## Route structure

- How I can help: `/how-can-help`; individual offers: `/book-a-session/[slug]`.
- Meet Staci: `/meet-staci`; Speaking: `/speaking`; Contact: `/contact`.
- Book a session: `/book-a-session`; coffee calendars and programme calendars sit beneath it.
- Resources: `/resources`; planner and AI support pages sit beneath it.
- Blog: `/blog`; articles use `/blog/[slug]`.
- Affiliate Disclaimer: `/affiliate-disclaimer`.

All former public addresses redirect directly to their current destination with status 301. Internal links, breadcrumbs, previews and the sitemap use the current routes. Section field names are stable and do not depend on public route slugs.
