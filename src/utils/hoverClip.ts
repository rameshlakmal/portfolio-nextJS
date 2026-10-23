// Plays a project's hover clip. Clips never load or play on touch screens,
// with reduced motion, or when the visitor saves data. Elsewhere a clip is
// loaded once its project scrolls into view, so it starts at once on hover.

const canPlay = () =>
  document.documentElement.classList.contains('motion') &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

const load = (video: HTMLVideoElement) => {
  if (video.dataset.loaded) return;
  // Browsers only allow play() without a click when the property (not just the
  // attribute) says muted.
  video.muted = true;
  video.preload = 'auto';
  video.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((source) => {
    source.src = source.dataset.src!;
  });
  video.load();
  video.dataset.loaded = 'true';
};

let observer: IntersectionObserver | undefined;

// Start downloading each clip when its project comes near the viewport.
export const preloadWhenVisible = (videos: Iterable<HTMLVideoElement>) => {
  if (!canPlay() || !('IntersectionObserver' in window)) return;
  observer ??= new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        load(entry.target as HTMLVideoElement);
        observer!.unobserve(entry.target);
      }),
    { rootMargin: '200px 0px' },
  );
  for (const video of videos) observer.observe(video);
};

export const playClip = (video: HTMLVideoElement | null | undefined) => {
  if (!video || !canPlay()) return;
  load(video);
  video.dataset.wanted = 'true';
  video
    .play()
    .then(() => {
      // The pointer may have left while the clip was loading.
      if (video.dataset.wanted === 'true') video.classList.add('is-playing');
      else video.pause();
    })
    .catch((error) => console.debug('Hover clip could not play:', error));
};

export const stopClip = (video: HTMLVideoElement | null | undefined) => {
  if (!video) return;
  video.dataset.wanted = 'false';
  video.classList.remove('is-playing');
  // Rewind after the fade-out so the next hover starts from the beginning.
  setTimeout(() => {
    if (video.dataset.wanted === 'true') return;
    video.pause();
    video.currentTime = 0;
  }, 400);
};
