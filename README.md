# Laisiangtho — Static Bible Website

A mobile-first static Bible reader for GitHub Pages. The project separates HTML, CSS, JavaScript modules and JSON content. No framework or build step is required.

## Project structure

```text
laisangtho_static_website/
├── index.html
├── manifest.webmanifest
├── service-worker.js
├── data/
│   ├── books.json
│   ├── versions/tedim/books/   # Add your converted book JSON files here
│   └── user-data/
├── assets/
│   ├── css/                    # Design tokens, base, layout, components, reader, themes
│   └── js/
│       ├── app.js              # Application entry point
│       ├── core/               # Configuration, state, storage, DOM helpers
│       ├── data/               # JSON repository and validation
│       └── features/            # Navigation, reader, search, settings, personal data
├── icons/
├── tools/validate-books.py
└── run-local.bat
```

## Add your existing JSON Bible files

Copy your 26 converted JSON files into `data/versions/tedim/books/`. Keep every filename exactly as generated, including spaces, apostrophes, capitalization and version suffixes. Examples:

- `01 Piancil.json`
- `02 Paikhiatna.json`
- `19 Late.json`
- `22 Solomon' La.json`
- `41 Mattithyah Draft.json`
- `42 YahchananMarkv26r0.json`

The website catalogue already references those exact filenames. **The 26 JSON Bible data files were not attached to this request, so they are not included in this ZIP.** The website shell and catalogue are ready; copy your JSON files into the folder above before reading those books.

## The 66-book catalogue

`data/books.json` contains all 66 books in standard Bible order. The 26 books you supplied are marked available, with their exact JSON filenames and reported chapter/verse totals. The remaining 40 entries are name-only placeholders and are disabled until their JSON files are added.

For missing books, English canonical names are temporary labels because Tedim titles were not supplied. You can replace their `display_name` values in `data/books.json` later.

Canonical order is separate from physical filenames. Your Matthew and Mark filenames have prefixes `41` and `42`, although their standard canonical positions are 40 and 41. The website preserves your exact filenames and does not rename them.

## Run locally

Do not double-click `index.html`; browsers restrict module imports and JSON fetches from `file://`. On Windows, double-click `run-local.bat`, or run:

```bash
py -m http.server 8000
```

Open `http://localhost:8000`.

## Publish with GitHub Pages

1. Upload the contents of this folder to the root of your GitHub repository (so `index.html` is at repository root).
2. Commit and push.
3. Open repository **Settings → Pages**.
4. Choose **Deploy from a branch**, select `main` (or your deployment branch), and choose `/ (root)`.
5. Save and wait for GitHub Pages to publish.

Relative paths are used so this works for a GitHub project site and a custom domain.

## Current functionality

- Full 66-book catalogue with explicit “text not added” status.
- Lazy loading of a book's JSON only when selected.
- Chapter selection and previous/next chapter controls.
- Left/right swipe chapter navigation on touch screens.
- Search within the currently loaded book.
- Adjustable reading font size.
- Light, dark and system themes.
- Browser-local bookmarks, notes and highlights.
- Copy/share verse actions where supported by the browser.
- Responsive mobile, tablet and desktop layouts.
- Service worker caches the app shell and successfully opened JSON books for repeat/offline use.

## Architecture and future expansion

Bible text is read-only public content. User-specific information must stay separate. The current local browser data is not synchronized between devices and is not backed up to GitHub.

Keep these responsibilities separate as the project grows:

- Bible content and translation catalogue: public read-only data.
- Bookmarks, notes, highlights, favourites and user accounts: separate private user-data service/database.
- Cross-references and parallel translations: separate data modules linked by stable book/chapter/verse references.
- Browser cache: performance/offline layer, not the source of truth.
- Settings: browser preferences initially; account sync only after a backend exists.

The data repository module is the boundary between the reader and the source of Bible content. A future database/API can replace it without redesigning the reading interface, provided it supplies the same logical book/chapter/heading/verse structure.

## JSON format expected

```json
{
  "schema_version": "1.1",
  "book": "Genesis",
  "chapters": [
    {
      "number": 1,
      "headings": [
        { "level": 1, "text": "Heading", "before_verse": 1 }
      ],
      "verses": [
        { "number": 1, "text": "Verse text..." }
      ]
    }
  ]
}
```

## Troubleshooting

- **Book does not load:** verify exact filename spelling, spaces, apostrophes and capitalization in both the folder and `data/books.json`.
- **Catalogue does not load:** confirm `data/books.json` is committed and the site is served via localhost or HTTPS.
- **JavaScript error:** open browser Developer Tools → Console. Errors are logged with the `[Laisiangtho]` prefix.
- **Offline use:** first open each book while online. Its JSON is cached after a successful load. Service workers require localhost or HTTPS.
- **A new release appears stale:** increment the cache name in `service-worker.js` when making a cache-breaking release.

## Public website and privacy

Anything committed to GitHub—including Bible JSON files—is public and downloadable. Bookmarks, notes, highlights and settings are currently stored only in the visitor's own browser. Do not put private account information or secrets in this repository.
