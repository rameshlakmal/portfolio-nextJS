// Color themes. Each one only swaps the palette variables in variables.js,
// so every component picks it up without knowing which theme is active.
// The site uses one dark and one light theme (see the ids at the bottom); the
// other palettes stay here so the pair is easy to change.

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

// Blend two hex colors; t = 0 gives `a`, t = 1 gives `b`.
const mix = (a, b, t) => {
  const A = toRgb(a);
  const B = toRgb(b);
  return `#${A.map((v, i) =>
    Math.round(v + (B[i] - v) * t)
      .toString(16)
      .padStart(2, '0'),
  ).join('')}`;
};

// Builds a dark theme from three colors. Every other shade (muted text,
// borders, card surfaces) is the text color blended into the background.
const threeColorTheme = ({ id, label, background, text, accent }) => ({
  id,
  label,
  scheme: 'dark',
  colors: {
    darkNavy: mix(background, '#000000', 0.25),
    navy: background,
    lightNavy: mix(background, text, 0.04),
    lightestNavy: mix(background, text, 0.12),
    shadow: 'rgba(0, 0, 0, 0.6)',
    darkSlate: mix(background, text, 0.45),
    slate: mix(background, text, 0.7),
    lightSlate: mix(background, text, 0.85),
    lightestSlate: text,
    white: text,
    accent,
    accentRgb: toRgb(accent).join(', '),
    onAccent: background,
    surface: mix(background, text, 0.04),
    border: mix(background, text, 0.12),
  },
});

// Light counterpart: the page is the background color, cards are a little
// lighter, and text shades are the text color blended into the background.
const lightTheme = ({ id, label, background, text, accent }) => {
  const card = mix(background, '#ffffff', 0.6);
  const textRgb = toRgb(text).join(', ');
  return {
    id,
    label,
    scheme: 'light',
    colors: {
      darkNavy: mix(background, text, 0.04),
      navy: background,
      lightNavy: card,
      lightestNavy: mix(background, text, 0.12),
      shadow: `rgba(${textRgb}, 0.12)`,
      darkSlate: mix(background, text, 0.5),
      slate: mix(background, text, 0.76),
      lightSlate: mix(background, text, 0.86),
      lightestSlate: text,
      white: '#000000',
      accent,
      accentRgb: toRgb(accent).join(', '),
      onAccent: '#ffffff',
      surface: `rgba(${toRgb(card).join(', ')}, 0.82)`,
      border: `rgba(${textRgb}, 0.12)`,
    },
  };
};

const palettes = [
  threeColorTheme({
    id: 'midnight',
    label: 'Ink & Violet',
    background: '#0f1115',
    text: '#e6e8ee',
    accent: '#a78bfa',
  }),
  threeColorTheme({
    id: 'amber',
    label: 'Charcoal & Amber',
    background: '#141414',
    text: '#ede6da',
    accent: '#f0b44c',
  }),
  threeColorTheme({
    id: 'redpen',
    label: 'Graphite & Red Pen',
    background: '#111111',
    text: '#eaeaea',
    accent: '#ff5a4e',
  }),
  threeColorTheme({
    id: 'forest',
    label: 'Night Forest',
    background: '#0f1512',
    text: '#e4ebe6',
    accent: '#7ccf9a',
  }),
  threeColorTheme({
    id: 'coral',
    label: 'Navy & Coral',
    background: '#0d1321',
    text: '#e8ecf4',
    accent: '#ff7a59',
  }),
  threeColorTheme({
    id: 'ocean',
    label: 'Deep Ocean & Cyan',
    background: '#0b1622',
    text: '#e3edf5',
    accent: '#4fd1e8',
  }),
  threeColorTheme({
    id: 'plum',
    label: 'Plum & Rose',
    background: '#17111c',
    text: '#efe7f0',
    accent: '#f47fae',
  }),
  threeColorTheme({
    id: 'mocha',
    label: 'Mocha & Sky',
    background: '#1b1613',
    text: '#f1e7de',
    accent: '#8cc7f2',
  }),
  threeColorTheme({
    id: 'oled',
    label: 'True Black & Lime',
    background: '#000000',
    text: '#ececec',
    accent: '#c6f432',
  }),
  threeColorTheme({
    id: 'slate',
    label: 'Slate & Mint',
    background: '#1e242c',
    text: '#e6eaef',
    accent: '#5eead4',
  }),
  {
    id: 'paper',
    label: 'Paper',
    scheme: 'light',
    colors: {
      darkNavy: '#efede7',
      navy: '#f8f7f3',
      lightNavy: '#ffffff',
      lightestNavy: '#e2dfd7',
      shadow: 'rgba(40, 36, 28, 0.12)',
      darkSlate: '#8a867d',
      slate: '#4f4c46',
      lightSlate: '#3a3833',
      lightestSlate: '#1c1b18',
      white: '#000000',
      accent: '#b3261e',
      accentRgb: '179, 38, 30',
      onAccent: '#ffffff',
      surface: 'rgba(255, 255, 255, 0.82)',
      border: 'rgba(28, 27, 24, 0.12)',
    },
  },
  {
    id: 'linen',
    label: 'Linen',
    scheme: 'light',
    colors: {
      darkNavy: '#e9e4da',
      navy: '#f3efe7',
      lightNavy: '#fbf9f5',
      lightestNavy: '#ddd6c9',
      shadow: 'rgba(48, 40, 28, 0.12)',
      darkSlate: '#8b8476',
      slate: '#4d4940',
      lightSlate: '#38352e',
      lightestSlate: '#1f1d18',
      white: '#000000',
      accent: '#1f6f5c',
      accentRgb: '31, 111, 92',
      onAccent: '#ffffff',
      surface: 'rgba(251, 249, 245, 0.82)',
      border: 'rgba(31, 29, 24, 0.12)',
    },
  },
  lightTheme({
    id: 'cloud',
    label: 'Cloud & Cobalt',
    background: '#f4f7fb',
    text: '#121a26',
    accent: '#2454d6',
  }),
  lightTheme({
    id: 'lavender',
    label: 'Lavender & Indigo',
    background: '#f5f3fb',
    text: '#1c1830',
    accent: '#5b3fd1',
  }),
  lightTheme({
    id: 'blush',
    label: 'Blush & Berry',
    background: '#fbf3f4',
    text: '#261619',
    accent: '#b0244f',
  }),
  lightTheme({
    id: 'mist',
    label: 'Mist & Ember',
    background: '#eceff1',
    text: '#15191c',
    accent: '#b93a0b',
  }),
];

const defaultDarkTheme = 'oled';
const defaultLightTheme = 'mist';

// The nav toggle switches between these two. The dark one comes first, so it
// is also the fallback when no theme is set.
const themes = [defaultDarkTheme, defaultLightTheme].map((id) => palettes.find((t) => t.id === id));
const storageKey = 'theme';

export { themes, defaultDarkTheme, defaultLightTheme, storageKey };
