// Shared helpers for showing projects. Link labels and project kinds are
// derived from the URLs, so adding a project only means adding it to
// src/data/portfolio.js.

// Optional hover clips, produced by `npm run previews` as
// src/previews/<project id>.webm and .mp4.
const clipFiles = import.meta.glob('../previews/*.{webm,mp4}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const previewFor = (id) => {
  const webm = clipFiles[`../previews/${id}.webm`];
  const mp4 = clipFiles[`../previews/${id}.mp4`];
  return webm || mp4 ? { webm, mp4 } : null;
};

const linkFor = (url) => {
  if (!url) return null;
  if (url.includes('github.com')) return { url, label: 'Source', kind: 'code' };
  if (url.startsWith('/') || url.includes('linkedin.com'))
    return { url, label: 'Article', kind: 'writing' };
  return { url, label: 'Live app', kind: 'app' };
};

// Show the most useful link first: a live app, then an article, then source.
const linkOrder = { app: 0, writing: 1, code: 2 };

export const describe = (project) => {
  const links = [linkFor(project.external), linkFor(project.github)].filter(Boolean);
  links.sort((a, b) => linkOrder[a.kind] - linkOrder[b.kind]);
  return {
    ...project,
    year: new Date(project.date).getFullYear(),
    preview: project.id ? previewFor(project.id) : null,
    links,
    kinds: [...new Set(links.map((l) => l.kind))],
  };
};

export const byNewest = (a, b) => new Date(b.date) - new Date(a.date);

// Attributes for links that leave the site.
export const external = (url) =>
  url.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' };
