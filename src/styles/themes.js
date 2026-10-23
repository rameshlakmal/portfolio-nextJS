// The site's two color themes, one dark and one light. Each only sets the
// palette variables (see BaseLayout.astro), so every component picks it up
// without knowing which theme is active. The nav toggle switches between them.

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
const darkTheme = ({ id, label, background, text, accent }) => ({
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

// Light theme from the same three colors: the page is the background color, cards are a little
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

const themes = [
  darkTheme({
    id: 'oled',
    label: 'True Black & Lime',
    background: '#000000',
    text: '#ececec',
    accent: '#c6f432',
  }),
  lightTheme({
    id: 'mist',
    label: 'Mist & Ember',
    background: '#eceff1',
    text: '#15191c',
    accent: '#b93a0b',
  }),
];

// The dark theme comes first in the list, so it is also the fallback when no
// theme is set (e.g. JavaScript disabled).
const defaultDarkTheme = 'oled';
const defaultLightTheme = 'mist';
const storageKey = 'theme';

export { themes, defaultDarkTheme, defaultLightTheme, storageKey };
