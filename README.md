# Ramesh Lakmal – Portfolio

Personal portfolio of Ramesh Lakmal, QA Engineer. Live at [lakmalramesh.online](https://lakmalramesh.online).

It is a static site built with [Astro](https://astro.build/). Pages are plain HTML and CSS with a few small scripts for the menu, tabs and theme toggle; there is no front-end framework. A toggle in the nav switches between a dark theme (True Black & Lime) and a light one (Mist & Ember), and the site works on phones as well as desktop.

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
| Featured project and other projects  | `featuredProjects`, `projects`  |
| Resume link                          | `resumeUrl`                     |

Navigation links, email and social profiles are in `src/config.js`.

The home page lists the 6 newest projects (`HOME_LIMIT` in `src/components/sections/Work.astro`) and links to `/projects`, which lists everything with a Code / Writing filter. The old `/archive` URL redirects there.

### Adding a project cover

Put the image in `src/images/projectN/` and import it at the top of `portfolio.js`. Astro resizes and converts images at build time, so any reasonably sized PNG, JPG or WebP works. Keeping the source around 1000–1500px wide keeps the repository small.

### Hover video previews

A project's cover can play a short clip on hover: on the featured card, in the preview pane on the home page and on the `/projects` cards. Clips load only on first hover and never play on touch screens, with reduced motion or with data saver on.

1. Save the raw clip as `raw-previews/<project id>.mp4`, using the project's `id` from `portfolio.js` (e.g. `project7.mp4`). This folder is not committed.
2. Run `npm run previews` (requires [ffmpeg](https://ffmpeg.org/)). It writes small WebM and MP4 versions (960px, no audio, max 8 s) to `src/previews/`.
3. Rebuild. Projects without a clip keep the still image.

For a seamless hover, make the clip start and end on the cover image itself.

The current covers and clips are animated scenes built in code (`scripts/project-scenes/build.cjs`): one per project, with official tool logos and no text. To change one, edit its scene and run:

```sh
npm run scenes -- project3        # render one scene (or omit the id for all)
npm run previews -- --covers      # compress clips and refresh covers from the first frame
```

Rendering uses your installed Chrome (set `CHROME_PATH` if it is somewhere else).

## Themes

Each theme is one entry in `src/styles/themes.js`. Every color on the site comes from CSS variables, and a theme only changes their values.

Most themes are built from three colors: dark ones with `threeColorTheme({ background, text, accent })` and light ones with `lightTheme({ background, text, accent })`. Muted text, borders and card backgrounds are blended from the text and background colors. Only one dark and one light theme are used at a time: `defaultDarkTheme` and `defaultLightTheme` at the bottom of the file. The other palettes in the table stay in the file, so swapping the pair is a one-line change.

Actions (buttons, links, the toggle, carousel dots, the active tab marker) get a soft glow in the accent color through the `--glow` and `--glow-text` variables.

| Theme | Mode | Background | Text | Accent |
| --- | --- | --- | --- | --- |
| Ink & Violet | Dark | `#0f1115` | `#e6e8ee` | `#a78bfa` |
| Charcoal & Amber | Dark | `#141414` | `#ede6da` | `#f0b44c` |
| Graphite & Red Pen | Dark | `#111111` | `#eaeaea` | `#ff5a4e` |
| Night Forest | Dark | `#0f1512` | `#e4ebe6` | `#7ccf9a` |
| Navy & Coral | Dark | `#0d1321` | `#e8ecf4` | `#ff7a59` |
| Deep Ocean & Cyan | Dark | `#0b1622` | `#e3edf5` | `#4fd1e8` |
| Plum & Rose | Dark | `#17111c` | `#efe7f0` | `#f47fae` |
| Mocha & Sky | Dark | `#1b1613` | `#f1e7de` | `#8cc7f2` |
| True Black & Lime | Dark | `#000000` | `#ececec` | `#c6f432` |
| Slate & Mint | Dark | `#1e242c` | `#e6eaef` | `#5eead4` |
| Paper | Light | `#f8f7f3` | `#1c1b18` | `#b3261e` |
| Linen | Light | `#f3efe7` | `#1f1d18` | `#1f6f5c` |
| Cloud & Cobalt | Light | `#f4f7fb` | `#121a26` | `#2454d6` |
| Lavender & Indigo | Light | `#f5f3fb` | `#1c1830` | `#5b3fd1` |
| Blush & Berry | Light | `#fbf3f4` | `#261619` | `#b0244f` |
| Mist & Ember | Light | `#eceff1` | `#15191c` | `#b93a0b` |

On a first visit, the theme follows the device's light or dark setting. A visitor's pick is saved in their browser, and a small inline script in `src/layouts/BaseLayout.astro` applies it before the page paints, so the page never flashes the wrong colors.

To add a theme, add another `threeColorTheme({...})` or `lightTheme({...})` entry with a new `id`, then point `defaultDarkTheme` or `defaultLightTheme` at it. Keep the accent readable against the background (aim for a contrast ratio of at least 4.5:1).

## Logo and loading screen

The logo is an "R" whose leg turns into a check mark. It is defined in three places that share the same paths:

- `public/favicon.svg`: the browser tab icon
- `src/components/Logo.astro`: the logo in the nav, drawn in the active theme's colors
- `src/components/Loader.astro`: the loading screen, where the mark draws itself

The loading screen shows only on the first page view of a browser session. It stays up until the page has loaded, for at least 0.7 s and at most 2.5 s, and is skipped for visitors who prefer reduced motion. `public/apple-touch-icon.png` and `public/og.png` (the link-preview image) are rendered from the favicon and the hero section. Regenerate them if either changes.

## Project structure

```
src/
  components/            Nav, ThemeToggle, Footer, Logo, Loader, Icon, ProjectIndex
  components/sections/   Hero, About, Jobs, Work, Contact
  data/portfolio.js      all site content
  layouts/BaseLayout.astro   <head>, SEO tags, theme setup
  pages/                 home, /projects (all work), 404, project write-ups
  styles/                global.css, themes.js
public/                  favicon, fonts, link-preview image, robots.txt
```

## Deployment

`npm run build` writes a fully static site to `dist/`. On Netlify or Vercel, set the build command to `npm run build` and the output directory to `dist`. Both detect Astro automatically.

## Credits

The original layout was based on [Brittany Chiang's v4 portfolio](https://github.com/bchiang7/v4) (MIT). It has since been rebuilt in Astro with my own content, navigation, themes and logo.
