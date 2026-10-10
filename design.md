# The Oper8tor design system

Conversion priority: consultations and strategy sessions. Home → Services / Book Online → session detail → existing provider booking. Use “Book a session” in navigation, “Find your session” for introductory calls to action, and “Book this session” only on a session detail.

Preserve the black, gold and ivory brand and existing vector logos. Oswald 600 headings, Open Sans body; the logo retains its outlined script signature. Existing palette and font tokens live in app/assets/css/main.css; additional semantic tokens live in tokens.css. No new font downloads or motion dependencies.

Genre: modern minimal, with the established condensed display type. Home and biography use Split Studio / H2 split diptych with real Staci photography. Services explains areas of support and the working process using the split introduction and editorial sections; its action is “See sessions & prices”. Booking uses pricing cards to compare packages, prices and durations, as requested by the owner. The same cards show featured starting points on Home. Session details use an editorial brief with a contrasting booking summary. Navigation stays a balanced bar; footer stays compact and supporting. Avoid invented proof, icon card grids, duplicate programme blocks and competing signup forms on sales pages.

Consultation facts live once in Offers frontmatter. The shared list uses kind=consultation, order and featured. Prices are USD. Confirmed: $97 initial, $497 Fast Action / Client Relations / Brilliance, $997 Systems Audit, $1,497 Funnel Mapping. VIP Day is enquiry only. Preserve existing providers and public routes.

Responsive: stack diptychs and session rows below 768px, retain readable button labels and visible focus. No decorative motion. Check 320, 375, 414 and 768px and desktop before handoff.

## Section editing

Owner requested the Amstel Gospel Choir editing pattern: all pages expose named Studio tabs with structured titles, images and actions plus a short Markdown slot for each section. PageSections is the shared renderer; primary hero and photo layouts retain the established typography, imagery and responsive treatment. Text sections stack in reading order, removing nested grid/panel components from the editor.
