# Onuri localization

Languages: English (`/`), Japanese (`/ja/`), Korean (`/ko/`).

## Safety/SEO rules
- Do not force redirects based on IP, browser language, or geolocation.
- Keep one stable URL per language and page.
- Every language page must self-canonicalize.
- Every language equivalent must include reciprocal `hreflang` links for `en`, `ja`, `ko`, and `x-default`.
- Keep the visible language switcher user-controlled.
- When adding a new English page, add matching Japanese/Korean pages before adding it to `hreflang`/sitemap.
- Avoid unsupported product/privacy claims in translations.
- If legal/privacy text changes in English, review Japanese and Korean copies in the same release.

## Page structure
- Every `/ja/` and `/ko/` page is a clone of the English page with the same file name: identical markup, classes, inline CSS, scripts, images, QR code and cookie UI.
- Only visible text and language-specific SEO fields differ (`lang`, title, meta/OG/Twitter text, canonical, `og:url`, `og:locale`, structured-data text/URLs/`inLanguage`, language-switcher `aria-current`).
- Localized pages reference shared assets from the site root (`../`); internal page links stay relative so they resolve within the same language.
- There is no separate localized template or stylesheet. When an English page changes, regenerate its Japanese and Korean clones from it.

## Shared site chrome (October 2026)
- Header, mobile menu, breadcrumbs, footer and the EN/日本語/한국어 switcher are identical on every page and styled only by `onuri-site.css` (classes prefixed `on-`); behaviour is in `onuri-site.js`.
- The language switcher lives in the header (inside the mobile menu on phones) and in the footer. There is no floating switcher any more.
- Header/footer labels are translated per language; links inside them stay relative within the language folder, and the home link is `/`, `/ja/` or `/ko/`.
- When adding a page, add it to the header/footer link lists in all three languages and give it a translated label.
- Breadcrumbs: Home › page, or Home › Resources › guide for guide pages. The BreadcrumbList structured data mirrors the visible breadcrumb in each language.
