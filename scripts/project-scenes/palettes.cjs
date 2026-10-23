// One colour theme per project. The scenes are written with a fixed set of
// "design" colours; applyPalette() swaps them for the project's theme while
// leaving the official logos untouched.

const hex = (h) => h.replace('#', '').match(/../g).map((x) => parseInt(x, 16));
const toHex = (rgb) => `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
const mix = (a, b, t) => toHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * t));
const rgba = (h, a) => `rgba(${hex(h).join(',')},${+a.toFixed(3)})`;

// Dark theme from a background, an ink (light) colour and accents.
const dark = ({ bg, ink, accent, warn, red, blue, glow = accent }) => ({
  mode: 'dark',
  bg,
  bgCenter: mix(mix(bg, ink, 0.05), glow, 0.06),
  cursorStroke: bg,
  panel: mix(bg, ink, 0.06),
  tile: mix(bg, ink, 0.09),
  inner: mix(bg, ink, 0.09),
  inner2: mix(bg, ink, 0.11),
  seg: mix(bg, ink, 0.08),
  segBorder: mix(bg, ink, 0.13),
  bar: mix(bg, ink, 0.15),
  bar2: mix(bg, ink, 0.11),
  border: mix(bg, ink, 0.16),
  dots: mix(bg, ink, 0.18),
  muted: mix(bg, ink, 0.21),
  code: mix(bg, ink, 0.23),
  typedDim: mix(bg, ink, 0.32),
  wire: mix(bg, ink, 0.14),
  field: mix(bg, '#000000', 0.25),
  chart: mix(bg, '#000000', 0.3),
  typed: mix(bg, ink, 0.6),
  strong: ink,
  ink,
  inkAlpha: 1,
  shadowAlpha: 0.7,
  accent,
  warn,
  red,
  blue,
});

// Light theme: white panels on a tinted background.
const light = ({ bg, ink, accent, warn, red, blue }) => {
  const panel = '#ffffff';
  return {
    mode: 'light',
    bg,
    bgCenter: mix(bg, '#ffffff', 0.55),
    cursorStroke: '#ffffff',
    panel,
    tile: panel,
    inner: mix(panel, ink, 0.045),
    inner2: mix(panel, ink, 0.06),
    seg: mix(panel, ink, 0.04),
    segBorder: mix(panel, ink, 0.11),
    bar: mix(panel, ink, 0.12),
    bar2: mix(panel, ink, 0.075),
    border: mix(panel, ink, 0.14),
    dots: mix(panel, ink, 0.16),
    muted: mix(panel, ink, 0.2),
    code: mix(panel, ink, 0.2),
    typedDim: mix(panel, ink, 0.3),
    wire: mix(bg, ink, 0.18),
    field: mix(panel, ink, 0.015),
    chart: mix(panel, ink, 0.025),
    typed: mix(panel, ink, 0.45),
    strong: ink,
    ink,
    inkAlpha: 1.5,
    shadowAlpha: 0.16,
    accent,
    warn,
    red,
    blue,
  };
};

const PALETTES = {
  // Playwright + Azure DevOps: Azure sky blue
  project1: light({ bg: '#e7f0fa', ink: '#14243a', accent: '#0078d4', warn: '#d98a00', red: '#d13438', blue: '#00a3a3' }),
  // Playwright + ZeroStep: coral on midnight navy
  project2: dark({ bg: '#0d1530', ink: '#eef2ff', accent: '#ff7a59', warn: '#ffc857', red: '#ff5d73', blue: '#7aa2ff' }),
  // JMeter + InfluxDB + Grafana: Grafana orange on warm ember
  project3: dark({ bg: '#150d07', ink: '#fff1e4', accent: '#ff9830', warn: '#f2cc0c', red: '#f2495c', blue: '#5794f2' }),
  // Selenium + Jenkins: Selenium green on soft grey
  project4: light({ bg: '#eef0f2', ink: '#1b2027', accent: '#2f9e44', warn: '#e08e1b', red: '#d33833', blue: '#3c7dd9' }),
  // Performance testing basics: hot pink on deep plum
  project5: dark({ bg: '#160b21', ink: '#fbf2ff', accent: '#ff4d8d', warn: '#ffb547', red: '#ff7a3d', blue: '#9d8bff' }),
  // AIO Tests + GitHub Actions + Playwright: GitHub blue on near-white
  project6: light({ bg: '#eef2f7', ink: '#1f2328', accent: '#2f81f7', warn: '#bf8700', red: '#cf222e', blue: '#8250df' }),
  // TestPilot AI (Claude): terracotta on warm cream
  project7: light({ bg: '#f3ede3', ink: '#2a2118', accent: '#d97757', warn: '#c9962e', red: '#b54a3a', blue: '#5b7fc4' }),
  // Claude agents pipeline: gold on deep teal
  // Propmaster: indigo, like its own app, with green inserts and red REC
  project9: dark({ bg: '#0d0c26', ink: '#efeeff', accent: '#7c7cff', warn: '#f5b84a', red: '#ff5d6c', blue: '#3fd0a8' }),
  project8: dark({ bg: '#03201f', ink: '#ecfbf8', accent: '#f5b841', warn: '#ff8f5a', red: '#ff6b6b', blue: '#5ed3c3' }),
};

// Design colours used in build.cjs -> palette keys.
const MAP = {
  '#07090c': 'bg',
  '#0d1117': 'bgCenter',
  '#07090d': 'cursorStroke',
  '#0e1217': 'panel',
  '#0d1218': 'panel',
  '#121821': 'tile',
  '#10161d': 'tile',
  '#152029': 'tile',
  '#141a22': 'inner',
  '#161c24': 'inner2',
  '#18202a': 'inner2',
  '#151b23': 'seg',
  '#1d252f': 'segBorder',
  '#1f2731': 'bar',
  '#1c242e': 'bar',
  '#181f27': 'bar2',
  '#1a222b': 'bar2',
  '#222b36': 'border',
  '#232c37': 'border',
  '#262f3a': 'dots',
  '#29323d': 'muted',
  '#2a3440': 'code',
  '#26303b': 'code',
  '#3a4552': 'typedDim',
  '#1b222b': 'wire',
  '#0b0f14': 'field',
  '#0a0e13': 'chart',
  '#8fa0b3': 'typed',
  '#8a97a6': 'typed',
  '#e8edf3': 'strong',
  '#f4f7fb': 'strong',
  '#3dd6c6': 'accent',
  '#f2b24c': 'warn',
  '#ef6b5b': 'red',
  '#6aa8ff': 'blue',
};

const recolour = (text, p, unknown) =>
  text
    .replace(/#[0-9a-fA-F]{6}/g, (m) => {
      const key = MAP[m.toLowerCase()];
      if (!key) {
        unknown.add(m);
        return m;
      }
      return p[key];
    })
    .replace(/rgba\(255,\s*255,\s*255,\s*([\d.]+)\)/g, (_, a) => rgba(p.ink, Math.min(+a * p.inkAlpha, 1)))
    .replace(/rgba\(0,\s*0,\s*0,\s*([\d.]+)\)/g, (_, a) =>
      p.mode === 'light' ? rgba(p.ink, +a * p.shadowAlpha) : `rgba(0,0,0,${+(+a * p.shadowAlpha).toFixed(3)})`,
    );

// Recolours everything except the official logos (wrapped in <!--logo--> markers).
const applyPalette = (html, id) => {
  const p = PALETTES[id];
  if (!p) return html;
  const unknown = new Set();
  const out = html
    .split(/(<!--logo-->[\s\S]*?<!--\/logo-->)/)
    .map((part, i) => (i % 2 === 1 ? part : recolour(part, p, unknown)))
    .join('');
  if (unknown.size) console.warn(`${id}: colours without a palette mapping: ${[...unknown].join(', ')}`);
  return out;
};

module.exports = { applyPalette, PALETTES };
