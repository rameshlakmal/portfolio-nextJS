import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lakmalramesh.online',
  integrations: [sitemap()],
  // The old archive table was replaced by the /projects page.
  redirects: {
    '/archive': '/projects',
  },
  // Keep whitespace between inline elements (links inside sentences, etc.).
  compressHTML: true,
});
