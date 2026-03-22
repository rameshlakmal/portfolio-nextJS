import { css } from 'styled-components';

const variables = css`
  :root {
    /* 3-color palette: ink black + off-white + arctic teal accent */
    --dark-navy: #0b0d10;
    --navy: #0f1115;
    --light-navy: #151925;
    --lightest-navy: #1f2633;
    --navy-shadow: rgba(0, 0, 0, 0.7);
    --dark-slate: #5a6b7b;
    --slate: #a8b3c2;
    --light-slate: #d5dde8;
    --lightest-slate: #f4f8ff;
    --white: #ffffff;
    --green: #8b5cf6;
    --accent-rgb: 139, 92, 246;
    --green-tint: rgba(139, 92, 246, 0.12);
    --accent-glow-sm: 0 0 10px rgba(var(--accent-rgb), 0.28);
    --accent-glow-md: 0 0 14px rgba(var(--accent-rgb), 0.4), 0 0 34px rgba(var(--accent-rgb), 0.18);
    --accent-glow-xl: 0 0 18px rgba(var(--accent-rgb), 0.55), 0 0 52px rgba(var(--accent-rgb), 0.22);
    --accent-ring: 0 0 0 1px rgba(var(--accent-rgb), 0.22), 0 0 0 4px rgba(var(--accent-rgb), 0.08);
    --pink: #ff4d8d;
    --blue: #7aa2ff;

    --glass-bg: rgba(21, 25, 37, 0.55);
    --glass-bg-strong: rgba(21, 25, 37, 0.78);
    --glass-border: rgba(255, 255, 255, 0.14);
    --glass-blur: 16px;
    --glass-sheen: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.04) 35%,
      rgba(139, 92, 246, 0.07) 100%
    );

    --font-sans: 'Calibre', 'Inter', 'San Francisco', 'SF Pro Text', -apple-system, system-ui,
      sans-serif;
    --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;

    --fz-xxs: 12px;
    --fz-xs: 13px;
    --fz-sm: 14px;
    --fz-md: 16px;
    --fz-lg: 18px;
    --fz-xl: 20px;
    --fz-xxl: 22px;
    --fz-heading: 32px;

    --border-radius: 4px;
    --nav-height: 100px;
    --nav-scroll-height: 70px;

    --tab-height: 42px;
    --tab-width: 120px;

    --easing: cubic-bezier(0.645, 0.045, 0.355, 1);
    --transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);

    --hamburger-width: 30px;

    --ham-before: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
    --ham-before-active: top 0.1s ease-out, opacity 0.1s ease-out 0.12s;
    --ham-after: bottom 0.1s ease-in 0.25s, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    --ham-after-active: bottom 0.1s ease-out,
      transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  }
`;

export default variables;
