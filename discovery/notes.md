# Chippenham Wheelers presentation migration

Discovery captured 26 September 2026 from `https://www.chippenhamwheelers.org/` and the existing EmDash project. This document is evidence for the implementation review; it is not an implementation plan with code changes.

## Scope and evidence

- Source theme: Twenty Twenty-Four with the `twentytwentyfour-child` child theme.
- The child theme contains presentation CSS in `style.css` and PHP integration in `functions.php`; the live markup confirms the parent block theme supplies most of the structure.
- WordPress content and media are already imported into the destination D1/R2 resources. Do not reset, reseed, or re-import them.
- The live site was inspected at desktop width (1440px) and at a 390px mobile width for the home page.
- The reference captures are full-page PNGs. They include live external content where the source page embeds it; those embeds are evidence of the layout only.
- No demo or WordPress image has been copied into `discovery/images/`. Reuse rights for individual media assets have not been established; use the already-imported EmDash media where appropriate.

## Reference captures

| Capture | Source route | Purpose |
| --- | --- | --- |
| `screenshots/homepage.png` | `/` | Desktop home layout, header, feature sections, news, events/activity embeds, and footer. |
| `screenshots/homepage-mobile.png` | `/` at 390px | Mobile stacking, navigation behaviour, image scaling, and long-page spacing. |
| `screenshots/news.png` | `/our-news/` | News/archive presentation and recent-post listing. |
| `screenshots/post.png` | `/audax-series-2026-final-results-medals/` | Long single-post content, images, tables, and recent-post side content. |
| `screenshots/category.png` | `/category/uncategorised/` | WordPress category archive; this is the only current core category (`Uncategorised`, 362 posts). |
| `screenshots/page.png` | `/club-activities/` | Representative static page with a visual activity grid and internal activity links. |
| `screenshots/about.png` | `/about-us/` | Representative long static club page. |
| `screenshots/activities.png` | `/club-activities/` | Additional capture of the activity landing page while checking route variants. |
| `screenshots/404.png` | `/discovery-reference-404/` | Not-found state. |

## Live information architecture

The public header has a small utility strip with `Membership` and `Contact`, a search control, and a primary navigation containing:

- Home
- About Us
- Our News
- Club Calendar
- Club route library
- Club Activities
- Racing
- Youth
- Membership

The current menu uses several double-slash URLs in the source markup, but WordPress resolves them successfully. The destination should use clean canonical paths and preserve redirects for old public URLs where required.

Observed content branches:

| WordPress responsibility | Observed route(s) | Proposed EmDash responsibility |
| --- | --- | --- |
| Front page | `/` | `src/pages/index.astro`, with a dedicated club home composition rather than the starter recent-post-only view. |
| News archive | `/our-news/` | Posts collection archive, likely a fixed `/our-news/` route or a redirect from `/posts`. |
| Single news post | `/{post-slug}/` | Existing posts detail route, with a compatibility route decision required because the source uses root-level post slugs. |
| Static club page | `/about-us/`, `/racing/`, `/youth/`, `/membership/` | Pages collection and slug routes; preserve editorial Portable Text and imported media. |
| Activity landing page | `/club-activities/` | Pages collection or an explicit presentation route, depending on whether the imported page content contains the full grid. |
| Activity sub-pages | `/club-activities/{slug}/` | Pages collection with nested-path compatibility or explicit redirects. |
| Route library | `/club-activities/club-route-library/` | Static page presentation; external route data remains a separate concern. |
| Calendar | `/events/` | Out of scope for migration implementation; retain an external-link or placeholder decision only after review. The live page is primarily RideWithGPS embeds. |
| Category archive | `/category/uncategorised/` | Existing `src/pages/category/[slug].astro`; verify imported taxonomy terms rather than assuming the starter seed terms. |
| Tag archive | `/tag/{slug}/` | Existing `src/pages/tag/[slug].astro`; preserve only if imported tags are part of the required public URL set. |
| Search | Header search | Existing EmDash `LiveSearch` is the likely behaviour to restyle and align with the source header. |
| Not found | Any unresolved route | Existing `src/pages/404.astro`, restyled to the source presentation. |

## Visual system

### Colours

The child stylesheet and generated WordPress block styles establish these high-confidence values:

- Primary orange: `#ff732c` (links, utility navigation, buttons, highlights, and activity accents).
- Dark orange hover: `#914219`.
- Near-black text: `#111111` / `#000000`.
- Dark grey: `#333333`.
- Mid grey: `#666666`.
- Light grey panel/input background: `#e8e8e8`.
- White: `#ffffff`.
- Additional Twenty Twenty-Four palette values exist (`#cfcabe`, `#c2a990`, `#b04c1a`, `#b5bdbc`) but are not the dominant public presentation colours.

Headings use a black two-pixel bottom rule and a repeated orange/black title decoration image at `/wp-content/uploads/2024-img/title-bg.png`. The child CSS removes that decoration for selected news-menu headings. The implementation should reproduce the visual intent with CSS or imported media only after confirming the asset is available in R2.

### Type

- Body and search input: Raleway, with a sans-serif fallback.
- Headings, labels, date/event metadata, and many card titles: Oswald, usually uppercase or with a strong condensed appearance.
- Twenty Twenty-Four also declares Inter as its body preset and Cardo as its heading preset, but the child stylesheet and rendered site use Raleway and Oswald for the public presentation.
- The block preset has a normal size of 16px, medium `1.05rem`, small `0.9rem`, and large/extra-large values expressed with `clamp()`. The child overrides the single-post title to approximately 19px with light weight.

### Layout

- The page is a centred, wide, single-column block layout with full-width colour/image bands and constrained content inside them.
- The top utility strip is compact and orange. The main navigation is white with slash separators; hover changes the background to `#cccccc` and text to orange.
- The home page is assembled from large block sections: club identity/intro, a news area, external event/current-activity embeds, and a club-activities image grid over photographic backgrounds.
- News listings are compact, with Oswald titles, Raleway excerpts, orange read-more treatments, and light-grey description areas in selected components.
- Static pages can be very long and include headings, linked imagery, tables, and embedded/external content. Do not assume every page is a simple text article.
- The footer is a full-width dark/text disclaimer region. It includes `Copyright Chippenham and District Wheelers · SOS Design Consultancy Ltd` and an external-content responsibility notice.
- On screens below approximately 781px, the source hides the right-side search, removes the desktop image offset used by membership content, and stacks the block sections. The mobile capture should be treated as the baseline for navigation and long-content overflow decisions.

## Extracted design tokens for implementation

These are the agreed first-pass tokens for the Astro presentation. Values marked as source-derived come from the child stylesheet, Twenty Twenty-Four generated styles, or the rendered reference. They should be checked against the first implementation screenshots before being treated as final.

| Token | Value | Evidence / use |
| --- | --- | --- |
| `--cw-colour-primary` | `#ff732c` | Child CSS; utility links, actions, highlights, and accents. |
| `--cw-colour-primary-dark` | `#914219` | Child CSS hover state for utility navigation. |
| `--cw-colour-text` | `#111111` | Twenty Twenty-Four contrast preset and rendered text. |
| `--cw-colour-black` | `#000000` | Child heading rules and navigation decoration. |
| `--cw-colour-grey-dark` | `#333333` | Search button and body-adjacent dark grey. |
| `--cw-colour-grey` | `#666666` | Secondary text and metadata. |
| `--cw-colour-grey-light` | `#e8e8e8` | Search input and news description panels. |
| `--cw-colour-border` | `#dddddd` | Search input border. |
| `--cw-colour-white` | `#ffffff` | Header, navigation links, buttons, and page background. |
| `--cw-font-body` | `Raleway, sans-serif` | Child CSS and rendered search/body text. |
| `--cw-font-heading` | `Oswald, sans-serif` | Child CSS and rendered headings, labels, and card titles. |
| `--cw-font-size-base` | `16px` | Twenty Twenty-Four normal preset. |
| `--cw-font-size-small` | `0.9rem` | Twenty Twenty-Four small preset. |
| `--cw-font-size-medium` | `1.05rem` | Twenty Twenty-Four medium preset. |
| `--cw-font-size-large` | `clamp(1.39rem, 1.39rem + ((1vw - 0.2rem) * 0.767), 1.85rem)` | Twenty Twenty-Four large preset. |
| `--cw-font-size-title` | `clamp(2.5rem, 2.5rem + ((1vw - 0.2rem) * 1.283), 3.27rem)` | Twenty Twenty-Four extra-large title scale; single-post titles are a deliberate smaller override of about `19px`. |
| `--cw-content-width` | `1200px` | Existing destination token and the wide constrained presentation visible in the references; verify against block geometry. |
| `--cw-page-gutter` | `20px` minimum | Existing destination layout and mobile screenshot; use fluid side padding above the minimum. |
| `--cw-mobile-breakpoint` | `781px` | Exact child CSS media-query boundary. |
| `--cw-heading-rule` | `2px solid #000000` | Child CSS for `h1`, `h2`, and `h4`. |
| `--cw-action-radius` | `5px` | Child CSS for news read-more treatments. |

### Responsive states

| State | Behaviour to reproduce |
| --- | --- |
| Desktop, `>781px` | Wide centred content; utility strip and full navigation visible; compact header search visible; multi-column/block compositions retain their image offsets; external embeds may occupy wide bands. |
| Mobile, `<=781px` | Search hidden from the top strip; navigation and content stack; image offsets reset; cards and activity panels become single-column; long tables and embeds require deliberate horizontal overflow handling. |
| Keyboard/focus | Preserve a visible focus indicator, skip-link access, semantic navigation landmarks, and button labels; do not rely on colour alone for hover/focus meaning. |
| Reduced motion | Avoid copying the source image hover fade unless it honours `prefers-reduced-motion: reduce`. |

### Component states

- Header: utility links, logo, primary navigation, mobile navigation control, and search. The selected/current route needs a state even though the source mostly communicates state through layout and colour.
- News card: optional image, Oswald title, date/category metadata, Raleway excerpt, orange action link, and empty-image fallback.
- Section heading: heading text, two-pixel black rule, and repeated title decoration where the source uses it; news-menu headings intentionally omit the decoration.
- Activity tile: imported image, linked title, hover/focus treatment, and stacked mobile layout.
- Cookie consent: an accessible, non-blocking header/banner treatment with accept and settings/decline actions; persist the decision and keep it separate from the content data model.
- Footer: copyright/design credit and external-content disclaimer, with a compact mobile stack.

### Deliberate substitutions

- Use CSS variables and CSS-generated decoration where that preserves the appearance; do not assume the source decorative GIF/JPG assets may be redistributed independently of the imported media.
- Use the imported EmDash media object and `<Image image={...} />` for CMS-managed images rather than WordPress URL strings.
- Treat external embeds as controlled presentation slots or links until their post-migration ownership is confirmed; do not build event or membership functionality into this theme port.
- Keep consent copy and storage implementation separate from the imported WordPress content so the banner can be replaced or configured without changing editorial entries.

## Components and behaviour to preserve

- Accessible skip-link target and keyboard-operable navigation/search.
- The reference captures show a cookie-acceptance popup from the live site. Recreate the consent behaviour as a cleaner, accessible header/banner-style solution rather than copying the popup presentation. Keep it visually aligned with the orange/white site system, provide clear accept and settings/decline choices as required by the consent policy, and ensure it does not obscure primary content or navigation.
- Site logo/header identity from imported media rather than a text-only starter header.
- Primary and utility menus as editor-managed EmDash menus where the imported data supports them.
- Search field and button styling, including the compact desktop-only header search treatment.
- News cards/listing and recent-post navigation.
- Portable Text content with headings, links, images, lists, quotes, tables where imported content requires them.
- Featured images as EmDash image objects rendered through the EmDash `Image` component.
- External embeds/links are presentation evidence only. RideWithGPS, Strava, Google sheets/DataTables, and other third-party services should not be recreated as native CMS features in this migration phase.
- Responsive heading rules, card stacking, image scaling, table overflow, focus states, and reduced-motion behaviour need explicit implementation verification later.

## WordPress-to-EmDash mapping notes

The existing project already has the right broad route families and server-rendered configuration:

- `astro.config.mjs` uses `output: "server"`, Cloudflare, D1, and R2.
- `src/layouts/Base.astro` owns site settings, the primary menu, search, and EmDash head/body contribution hooks.
- `src/pages/index.astro` is currently only a starter recent-post list and must become the club home composition in the implementation phase.
- `src/pages/posts/index.astro`, `src/pages/posts/[slug].astro`, the page slug route, taxonomy routes, and `src/pages/404.astro` are the existing conversion targets.
- `src/styles/global.css` already contains a small Chippenham colour vocabulary, but it is not yet a reproduction of the source layout.
- The current checked-in `seed/seed.json` is starter/demo schema and content. It must not be applied to the populated destination resources. Runtime/imported content is the source of truth for implementation discovery.
- Existing content queries correctly use server-side EmDash APIs, cache hints, `entry.id` for URL slugs, `entry.data.id` for database lookups, and `Image` for image fields. Preserve those constraints during implementation.

## Explicitly out of scope

- Event management and membership management; these have moved outside WordPress.
- Legacy shop, basket, checkout, and member-account functionality.
- Rebuilding third-party event, route, Strava, spreadsheet, or calendar applications as EmDash features.
- Resetting, reseeding, or re-importing the EmDash D1/R2 resources.
- Modifying application source files during this discovery phase.

## Open decisions for implementation review

1. Confirm the canonical destination URL strategy for root-level WordPress post slugs versus the existing `/posts/{slug}` route, including redirects.
2. Confirm which imported WordPress pages are public presentation targets and which belong to the excluded membership/event systems.
3. Confirm whether the activity grid should remain editor-managed page content or become a dedicated structured collection/component.
4. Confirm whether the imported menus contain the utility links separately from the primary menu, or whether a second EmDash menu should be created during implementation.
5. Confirm availability and permitted reuse of the imported title decoration, logo, background, and activity-card media.
6. Confirm the desired treatment for `/events/` after the external event system is considered authoritative.
7. Verify imported collection names, fields, taxonomies, menu data, and media references against the live populated D1/R2 instance before changing templates. This should use read-only inspection only.
## Main navigation sections discovery — 26 September 2026

Reference captures are in `discovery/screenshots/sections/`.

- **Club Calendar**: the requested `/club-calendar/` URL is new; the live WordPress source is `/events/`. It is primarily a `CLUB CALENDAR` heading and a RideWithGPS events embed for club `16143`, with a direct FAQ link. The authoritative event data remains RideWithGPS; no Events Manager output or `[events_list]` shortcode should be migrated.
- **Club Activities**: ordinary editorial content with a programme introduction, risk/cancellation guidance, non-member participation and preparation information. It links to the glossary, club handbook PDF, ICE ID, insurance and activity material. The page contains repeated activity imagery on the live site but no shortcode or iframe.
- **Youth**: ordinary editorial content with the Young Wheelers Awards Scheme, distance/logbook awards, registration guidance, certificates/badges and a `youth@chippenhamwheelers.org` contact link. It has a youth header image and no plugin output.
- **Racing**: a long editorial page with introductory copy, quick-access links, time-trial guidance, courses, competitions, results, records, trophies, historic pages and external CTT/WTTA/British Cycling links. It has a racing hero and several legacy PDF/image links. The source includes awkward historical layout text but no shortcodes or embeds; preserve useful links without recreating obsolete plugin behaviour.
- **Membership**: ordinary informational content explaining that membership is managed externally by RiderHQ, CSSC benefits, membership periods/prices and membership categories. `Apply for membership` links point to RiderHQ. No account, payment or membership-management functionality is in scope.

Shared implementation: use the generic EmDash page renderer for the four editorial pages. Use a small dedicated calendar route only for the RideWithGPS embed and direct-link fallback. Local fixtures in `discovery/local-sections/` provide representative CMS content for development without changing production D1/R2.
