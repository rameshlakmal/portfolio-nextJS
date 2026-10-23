# Ramesh Lakmal – Portfolio

Personal portfolio of Ramesh Lakmal, QA Engineer. Live at [lakmalramesh.online](https://lakmalramesh.online).

It is a static site built with [Astro](https://astro.build/). Pages are plain HTML and CSS with a few small scripts for the menu, tabs, carousel and theme toggle; there is no front-end framework. The site has a dark and a light theme and works on phones as well as desktop.

## Running locally

Requires Node.js 22.12 or newer.

```sh
npm install
npm run dev        # dev server at http://localhost:4321, updates as you edit
```

Production build and preview:

```sh
npm run build      # static output in dist/
npm run preview    # serve dist/ at http://localhost:4321
```

## Updating content

Most edits only need one file: **`src/data/portfolio.js`**.

| What                                 | Where in `portfolio.js`         |
| ------------------------------------ | ------------------------------- |
| Name, title, location, contact links | `person`                        |
| Hero text and button                 | `hero`                          |
| About paragraphs and skills          | `about`                         |
| Jobs                                 | `jobs` (`tabLabel` is optional) |
| Education and certifications         | `education`, `certifications`   |
| Featured projects and other projects | `featuredProjects`, `projects`  |
| Resume link                          | `resumeUrl`                     |

Navigation links, email and social profiles are in `src/config.js`.

The Work section on the home page has two parts:

- **Featured projects**: an endless carousel with the current card in front and its neighbors blurred behind it. Visitors move through it with the dots, by swiping, with the arrow keys or by clicking a card behind.
- **Latest work**: the 6 newest projects (`HOME_LIMIT` in `src/components/sections/Work.astro`), with a large preview of the hovered project, and a link to `/projects`. That page lists every project as a card grid with an All / Code / Writing filter. The old `/archive` URL redirects there.

Every project needs a unique `id` (e.g. `project9`). It links the project to its hover video.

### Adding a project cover

Put the image in `src/images/projectN/` and import it at the top of `portfolio.js`. Astro resizes and converts images at build time, so any PNG, JPG or WebP works. Covers are shown at 16:9, so a 1600×900 source looks sharpest.

### Hover video previews

A project's cover can play a short muted clip on hover: on the featured card, in the Latest work preview and on the `/projects` cards. Clips start loading once they scroll into view, and they never play on touch screens, with reduced motion or with data saver on.

1. Save the raw clip as `raw-previews/<project id>.mp4` (e.g. `project7.mp4`). This folder is not committed.
2. Run `npm run previews` (requires [ffmpeg](https://ffmpeg.org/)). It writes WebM and MP4 versions (1600px wide, no audio, max 8 s) to `src/previews/`.
3. Rebuild. Projects without a clip keep the still image.

For a seamless hover, make the clip start on the cover image itself.

The current covers and clips are animated scenes built in code (`scripts/project-scenes/build.cjs`). Each project has its own scene and color palette (`palettes.cjs`), with official tool logos and short text labels. To change one, edit its scene and run:

```sh
npm run scenes -- project3        # render one scene (or omit the id for all)
npm run previews -- --covers      # compress clips and refresh covers from the first frame
```

Rendering uses your installed Chrome (set `CHROME_PATH` if it is somewhere else).

## Themes

The site has two themes, both defined in `src/styles/themes.js`:

| Theme             | Mode  | Background | Text      | Accent    |
| ----------------- | ----- | ---------- | --------- | --------- |
| True Black & Lime | Dark  | `#000000`  | `#ececec` | `#c6f432` |
| Mist & Ember      | Light | `#eceff1`  | `#15191c` | `#b93a0b` |

Each theme is built from those three colors with `darkTheme({ background, text, accent })` or `lightTheme({ ... })`. Muted text, borders and card backgrounds are blended from the text and background colors. Every color on the site comes from CSS variables, and a theme only changes their values.

A sun/moon toggle in the nav switches between the two, and the new theme spreads across the page in a circle from the toggle. On a first visit, the theme follows the device's light or dark setting. Once a visitor uses the toggle, their choice is saved in their browser, and a small inline script in `src/layouts/BaseLayout.astro` applies it before the page paints, so the page never flashes the wrong colors.

Actions get a soft glow in the accent color through the `--glow` and `--glow-text` variables. This covers buttons and links on hover, the toggle, the active carousel dot and the tab and list markers.

To change a theme, edit its colors in `themes.js`. Keep the accent readable against the background (a contrast ratio of at least 4.5:1).

## Motion

Motion is kept small and purposeful:

- sections fade in as they scroll into view
- heading rules draw in
- the Experience tab marker slides between tabs
- the logo's check mark redraws on hover
- buttons lift on hover

All of it is turned off for visitors who prefer reduced motion.

## Logo and loading screen

The logo is an "R" whose leg turns into a check mark. It is defined in three places that share the same paths:

- `public/favicon.svg`: the browser tab icon
- `src/components/Logo.astro`: the logo in the nav, drawn in the active theme's colors
- `src/components/Loader.astro`: the loading screen, where the mark draws itself

The loading screen shows only on the first page view of a browser session. It stays up until the page has loaded, for at least 0.7 s and at most 2.5 s, and is skipped for visitors who prefer reduced motion. `public/apple-touch-icon.png` and `public/og.png` (the link-preview image) are rendered from the favicon and the hero section. Regenerate them if either changes.

## Project structure

```
src/
  components/            Nav, ThemeToggle, Footer, Logo, Loader, Icon, HoverClip,
                         ProjectIndex (Latest work), ProjectGrid (/projects)
  components/sections/   Hero, About, Jobs, Work, Contact
  data/portfolio.js      all site content
  images/                project covers and article images
  layouts/BaseLayout.astro   <head>, SEO tags, theme setup, scroll reveal
  pages/                 home, /projects, 404, project write-ups
  previews/              hover video clips (WebM + MP4)
  styles/                global.css, themes.js
  utils/                 project helpers, hover clip playback
scripts/
  encode-previews.mjs    compresses clips and creates covers
  project-scenes/        animated scenes behind the covers and clips
public/                  favicon, fonts, link-preview image, robots.txt
```

## Deployment

`npm run build` writes a fully static site to `dist/`. On Netlify or Vercel, use:

- Build command: `npm run build`
- Output directory: `dist`
- Node.js version: 22.12 or newer (`.nvmrc` pins 22)

Both platforms detect Astro automatically.

## Credits

The original layout was based on [Brittany Chiang's v4 portfolio](https://github.com/bchiang7/v4) (MIT). It has since been rebuilt in Astro with my own content, design, themes and logo.
