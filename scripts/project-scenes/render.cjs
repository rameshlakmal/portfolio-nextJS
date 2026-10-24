// Renders each scene frame by frame (deterministic: animations are paused and
// seeked), then assembles an 8 s, 24 fps MP4 per project with ffmpeg.
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');
const { spawnSync } = require('child_process');

const scenesDir = path.join(__dirname, 'out');
const outDir = path.join(__dirname, '..', '..', 'raw-previews');
const idsArg = process.argv[2] || 'project1,project2,project3,project4,project5,project6,project7,project8,project9,project10';
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ids = idsArg.split(',');
const FPS = 24;
const SECONDS = 8;

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1.5 });
  for (const id of ids) {
    const framesDir = path.join(scenesDir, 'frames', id);
    fs.rmSync(framesDir, { recursive: true, force: true });
    fs.mkdirSync(framesDir, { recursive: true });
    await page.goto(pathToFileURL(path.join(scenesDir, `${id}.html`)).href, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const total = FPS * SECONDS;
    for (let f = 0; f < total; f += 1) {
      const ms = (f / FPS) * 1000;
      await page.evaluate((t) => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t; }), ms);
      // Lossless frames: JPEG smears thin coloured lines.
      await page.screenshot({ path: path.join(framesDir, `${String(f).padStart(4, '0')}.png`) });
    }
    const out = path.join(outDir, `${id}.mp4`);
    const r = spawnSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(framesDir, '%04d.png'),
      '-vf', 'scale=out_range=tv,format=yuv420p', '-color_range', 'tv',
      '-c:v', 'libx264', '-crf', '10', '-preset', 'slow', out], { stdio: 'inherit' });
    console.log(id, r.status === 0 ? `ok ${Math.round(fs.statSync(out).size / 1024)} KB` : 'FAILED');
  }
  await browser.close();
})();
