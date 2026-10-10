# Migration record — 10 October 2026

The source is https://theoper8tor.com/. Its homepage is available on both hostnames, but most subpages return 404 on `www.theoper8tor.com`; extraction used the bare domain for those pages. The site was created in a hosted funnel builder. Source HTML is archived as inert files in `docs/source/`, with fetch outcomes in `crawl*.json` and image provenance in `assets.json`.

## Coverage

30 Nuxt Content pages cover the homepage, Speaker, Services, six consultation detail pages, Ready to Scale, Book Online, five calendar/coffee pages, Contact, Shop, current Connect, Schedule, Affiliate Disclaimer, About, planner, AI, newsletter and four linked blog articles. `/home` redirects to `/`; `/coffeechat` redirects to `/intentionalcoffeechat`. External resource redirects for the caregiver collection, InterCultural Voices, speaker bundle and Health Hunters article are retained. They are linked as external resources rather than copying third-party sales or editorial pages into this website.

73 available images are hosted locally, including the original logo and four recovered SVG icons. Sixteen large originals were replaced with the source CDN's existing 1200-pixel WebP variants, reducing public assets from approximately 88 MiB to 21 MiB. A Facebook-hosted image in the imposter-syndrome article had an expired source URL and was omitted; its source is retained in the archived HTML. The article's principal image remains available.

The full static affiliate disclaimer was recovered from a custom HTML block. Custom scripts, platform tracking and the chat widget are excluded. The original Spotify playlist, YouTube video, contact form, party-line signup, newsletter form and calendars are available as explicit opt-in embeds. The planner's purchase action points to the verified provider preview containing the original checkout; moving the main domain does not redirect that action back into the migrated page.

The public email `sim@theoper8tor.com` was recovered from the Cloudflare-obfuscated link in the Google Account Purge article. The phone number is retained from the source. The broken Speaker menu URL and missing protocols on external/social URLs were normalized. Source paragraphs styled as headings were converted to body text where appropriate. Source typos in the homepage's “Brilliance” and “I'm a speaker” were corrected.

## Content requiring owner review

These are source issues, not missing Nuxt features:

- Initial Consultation is advertised as 90 minutes on Book Online and 30 minutes on its own page. Both source values are retained.
- Visible VIP Day shows both `$3000 / 6 HR` and `$997` on Book Online. No authoritative replacement price was supplied.
- Schedule contains December 2022 purchase links and old event information. The source listings are retained as imported content; update before promoting them.
- `/about` contains an unrelated Build.Inc gym template. It is preserved at its old address for review and is absent from the main navigation.
- `/gmbauditsp2pplanner`, `/eoyoffercheckout` and `/thecaringcorner` return 404 on the source site. Their Connect-page links remain explicit external URLs to the source, so they do not create nonexistent local pages. Replace them with working destinations before launch.
- Source Shop buttons have unspecified/empty destinations. A Contact action was added; the full services overview and linked consultation pages provide working alternatives.
- Ready to Scale pages contain a “Sign up as an Affiliate” button without a destination. That nonfunctional button is omitted; programme copy and calendars are retained.
- The original blog template contained an unrelated invitation footer for another project. That shared footer was omitted from the migrated articles.
- The source AI page contains placeholder phrases such as “Small Call to Action Headline”. These remain editable source copy and should be revised.
- The source phone/contact introduction and copyright years are retained; confirm current business details and dates.

## Validation and limits

Type checking, static generation and content integrity tests cover public addresses, internal links, local images, menu/footer links, redirect destinations and Studio preview mappings. Marpos Studio's project inspector recognises all 12 collections without warnings. Desktop/mobile preview checks cover the homepage, navigation and representative pages. Provider pages were retrieved and contact/calendar embeds are checked without submitting data; purchases, email delivery and actual appointment creation were not exercised.

Static redirects use `public/_redirects`; hosts that do not support that format need equivalent redirect rules. Node hosting uses Nuxt route rules. A Dockerfile is included using vdzmediation's approach, but Docker was not built in this session.

No repository or hosting configuration was changed. Create/connect the project repository and deployment separately. Maintain `content/`, not the archived HTML. `scripts/migrate-source.py` is an extraction aid, not a build dependency; rerunning it would overwrite editorial changes.
