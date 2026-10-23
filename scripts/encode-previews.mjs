// Compresses hover-preview clips for the project covers.
//
//   1. Save raw exports as raw-previews/<project id>.mp4 (e.g. project7.mp4).
//      Any format ffmpeg can read works (.mp4, .mov, .webm).
//   2. Run `npm run previews` (needs ffmpeg on your PATH).
//
// Each clip becomes src/previews/<id>.webm and <id>.mp4: 1600px wide, 24 fps,
// no audio, at most 8 seconds. The site picks them up automatically.
//
// `npm run previews -- --covers` also replaces src/images/<id>/cover.webp with
// the clip's first frame, so the still cover and the clip always match.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

const RAW_DIR = 'raw-previews';
const OUT_DIR = join('src', 'previews');
const VIDEO = /\.(mp4|mov|webm|mkv)$/i;
// Standard (TV) range 4:2:0: some hardware decoders refuse full-range video.
const WIDTH = 1600; // sharp on high-density screens, even in the wide featured card
const FILTERS = `fps=24,scale=${WIDTH}:-2:flags=lanczos:out_range=tv,format=yuv420p`;
const UPDATE_COVERS = process.argv.includes('--covers');

const ffmpeg = (args) => {
  const result = spawnSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
  if (result.error) {
    console.error('Could not run ffmpeg. Install it and make sure it is on your PATH.');
    process.exit(1);
  }
  return result.status === 0;
};

if (!existsSync(RAW_DIR)) {
  console.log(`No ${RAW_DIR}/ folder. Create it and add clips named after the project id.`);
  process.exit(0);
}
mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(RAW_DIR).filter((f) => VIDEO.test(f));
if (files.length === 0) {
  console.log(`No clips found in ${RAW_DIR}/.`);
  process.exit(0);
}

for (const file of files) {
  const id = basename(file, extname(file));
  const input = join(RAW_DIR, file);
  const common = ['-i', input, '-t', '8', '-an', '-vf', FILTERS, '-color_range', 'tv'];

  const webm = join(OUT_DIR, `${id}.webm`);
  const mp4 = join(OUT_DIR, `${id}.mp4`);
  const ok =
    ffmpeg([...common, '-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '1', webm]) &&
    ffmpeg([
      ...common,
      '-c:v',
      'libx264',
      '-crf',
      '21',
      '-preset',
      'slow',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      mp4,
    ]);

  if (!ok) {
    console.error(`Failed: ${file}`);
    continue;
  }
  const kb = (f) => `${Math.round(statSync(f).size / 1024)} KB`;
  let coverNote = '';
  if (UPDATE_COVERS) {
    const coverDir = join('src', 'images', id);
    const cover = join(coverDir, 'cover.webp');
    if (!existsSync(coverDir)) {
      coverNote = `, no src/images/${id}/ folder so cover not updated`;
    } else if (
      ffmpeg([
        '-i',
        input,
        '-frames:v',
        '1',
        '-vf',
        `scale=${WIDTH}:-2:flags=lanczos`,
        '-c:v',
        'libwebp',
        '-quality',
        '90',
        cover,
      ])
    ) {
      coverNote = `, cover ${kb(cover)} (from first frame)`;
    }
  }
  console.log(`${id}: webm ${kb(webm)}, mp4 ${kb(mp4)}${coverNote}`);
}
