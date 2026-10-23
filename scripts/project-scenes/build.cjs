// Builds one animated HTML scene per project (8 s seamless loop, 1280x720).
// Each scene uses real labels from the project, the site's fonts, official
// logos, and its own colour theme (see palettes.cjs). The first frame shows
// the finished state and is used as the cover image.
const fs = require('fs');
const path = require('path');
const { applyPalette } = require('./palettes.cjs');

// Official logos, wrapped in markers so the colour themes never touch them.
const L = Object.fromEntries(
  Object.entries(require('./logos.json')).map(([k, svg]) => [k, `<!--logo-->${svg}<!--/logo-->`]),
);

const D = 8; // loop length in seconds
// Design colours (swapped per project by palettes.cjs)
const TEAL = '#3dd6c6'; // accent
const AMBER = '#f2b24c'; // warning
const RED = '#ef6b5b';
const BLUE = '#6aa8ff';
const INK = '#e8edf3'; // strong text
const SUB = '#8fa0b3'; // secondary text
const DIM = '#3a4552'; // faint text

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Keyframes from [seconds, css] steps; first and last step must match.
const kf = (name, steps) =>
  `@keyframes ${name}{${steps.map(([t, css]) => `${((t / D) * 100).toFixed(3)}%{${css}}`).join('')}}`;
const anim = (name, dur = D, ease = 'cubic-bezier(.45,0,.25,1)', delay = 0) =>
  `animation:${name} ${dur}s ${ease} ${delay}s infinite;`;

// ON at rest (first frame shows the finished state), resets at the start of
// the loop and comes back on at t.
const restOn = (name, t, off, on, fade = 0.25) =>
  kf(name, [
    [0, on],
    [0.3, off],
    [Math.max(t, 0.35), off],
    [Math.max(t, 0.35) + fade, on],
    [D, on],
  ]);

// A pulse that runs along a path once per loop.
const pulseKf = (name, t, len) =>
  kf(name, [
    [0, 'stroke-dashoffset:10;opacity:0'],
    [Math.max(t - 0.01, 0), 'stroke-dashoffset:10;opacity:0'],
    [t, 'stroke-dashoffset:10;opacity:1'],
    [t + len, 'stroke-dashoffset:-110;opacity:1'],
    [Math.min(t + len + 0.01, D), 'stroke-dashoffset:-110;opacity:0'],
    [D, 'stroke-dashoffset:-110;opacity:0'],
  ]);

// Neutral icons for tools without a public logo (no text).
const ICON = {
  sparkle: `<svg viewBox="0 0 24 24"><path fill="${TEAL}" d="M12 2l2.2 6.3L20.5 10.5 14.2 12.7 12 19l-2.2-6.3L3.5 10.5l6.3-2.2z"/><path fill="${TEAL}" opacity=".6" d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/></svg>`,
  board: `<svg viewBox="0 0 24 24" fill="none" stroke="${TEAL}" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16M15 4v16"/><path d="M5.5 8h1.5M11 8h1.5M11 11h1.5M17 8h1.5"/></svg>`,
  flask: `<svg viewBox="0 0 24 24" fill="none" stroke="${AMBER}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6L5 19a1.5 1.5 0 0 0 1.3 2h11.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/><path d="M7.5 15h9"/></svg>`,
  report: `<svg viewBox="0 0 24 24" fill="none" stroke="${TEAL}" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 16v-4M12 16V8M16 16v-6"/></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="#8a97a6" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="${TEAL}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="${TEAL}" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M8.5 12l2.5 2.5 4.5-5" stroke-linecap="round"/></svg>`,
  person: `<svg viewBox="0 0 24 24" fill="none" stroke="${TEAL}" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.2-3.6 3.8-5.5 7-5.5s5.8 1.9 7 5.5"/></svg>`,
  file: `<svg viewBox="0 0 24 24" fill="none" stroke="${SUB}" stroke-width="1.8" stroke-linejoin="round"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/></svg>`,
  cursor: `<svg viewBox="0 0 24 24"><path d="M5 3l14 8-6.2 1.5L10 19z" fill="#f4f7fb" stroke="#07090d" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
};

const FONT_DIR = '../../../public/fonts';
const BASE_CSS = `
@font-face{font-family:'Calibre';src:url('${FONT_DIR}/Calibre-Regular.woff2') format('woff2');font-weight:400}
@font-face{font-family:'Calibre';src:url('${FONT_DIR}/Calibre-Medium.woff2') format('woff2');font-weight:500}
@font-face{font-family:'Calibre';src:url('${FONT_DIR}/Calibre-Semibold.woff2') format('woff2');font-weight:600}
@font-face{font-family:'SF Mono';src:url('${FONT_DIR}/SFMono-Regular.woff2') format('woff2');font-weight:400}
@font-face{font-family:'SF Mono';src:url('${FONT_DIR}/SFMono-Semibold.woff2') format('woff2');font-weight:600}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1280px;height:720px;overflow:hidden;background:#07090c;font-family:'Calibre',sans-serif;color:${INK}}
.stage{position:relative;width:1280px;height:720px;overflow:hidden;
  background:radial-gradient(ellipse 75% 65% at 50% 45%,#0d1117 0%,#07090c 72%)}
.stage::before{content:'';position:absolute;inset:0;
  background-image:radial-gradient(rgba(255,255,255,.05) 1.2px,transparent 1.3px);background-size:24px 24px;
  -webkit-mask-image:radial-gradient(ellipse 70% 70% at 50% 50%,#000 30%,transparent 80%)}
.panel{position:absolute;background:#0e1217;border:1px solid rgba(255,255,255,.07);border-radius:16px;
  box-shadow:0 24px 60px -24px rgba(0,0,0,.9)}
.tile{position:absolute;width:84px;height:84px;border-radius:20px;background:#121821;
  border:1px solid rgba(255,255,255,.09);display:grid;place-items:center;
  box-shadow:0 16px 36px -16px rgba(0,0,0,.95)}
.tile svg{width:46px;height:46px}
.tile.sm{width:52px;height:52px;border-radius:14px}.tile.sm svg{width:28px;height:28px}
.tile.xs{width:40px;height:40px;border-radius:11px;box-shadow:none}.tile.xs svg{width:22px;height:22px}
/* Light plate for logos that disappear on dark backgrounds. */
.tile.plate{background:white;border-color:transparent}
.bar{height:8px;border-radius:4px;background:#1f2731}
.dots{position:absolute;left:16px;top:15px;display:flex;gap:6px}
.dots i{width:9px;height:9px;border-radius:50%;background:#262f3a;display:block}
.url{position:absolute;left:70px;right:16px;top:9px;height:22px;border-radius:11px;background:#161c24;
  font:400 13px/22px 'SF Mono',monospace;color:${SUB};padding-left:12px}
.wires{position:absolute;inset:0;width:1280px;height:720px;overflow:visible}
.wire{fill:none;stroke:#1b222b;stroke-width:2}
.pulse{fill:none;stroke:${TEAL};stroke-width:2.5;stroke-linecap:round;stroke-dasharray:10 110;stroke-dashoffset:10;
  filter:drop-shadow(0 0 6px ${TEAL})}
.chk{width:22px;height:22px;border-radius:50%;border:2px solid #29323d;display:grid;place-items:center;position:relative;flex-shrink:0}
.chk svg{width:14px;height:14px}
.t{position:absolute;white-space:nowrap}
.h{font-weight:600;font-size:20px;color:${INK}}
.h2{font-weight:600;font-size:18px;color:${INK}}
.s{font-size:16px;color:${SUB}}
.m{font-family:'SF Mono',monospace;font-size:14px;color:${SUB}}
.cap{font-family:'SF Mono',monospace;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:${SUB}}
`;

const page = (title, css, body) => `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
<style>${BASE_CSS}${css}</style></head><body><div class="stage">${body}</div></body></html>`;

const check = (cls, extra = '') => `<div class="chk ${cls}" ${extra}>${ICON.check}</div>`;
const checkKf = (name, t, css) => {
  css.push(restOn(name, t, 'border-color:#29323d;background:transparent', `border-color:${TEAL};background:${TEAL}22`));
  css.push(restOn(`${name}c`, t + 0.08, 'opacity:0;transform:scale(.4)', 'opacity:1;transform:scale(1)'));
  return `.${name}{${anim(name)}}.${name} svg{${anim(`${name}c`)}}`;
};

const scenes = {};

/* 1. Playwright + Azure Pipelines: the test drives the browser, the pipeline runs it. */
{
  const css = [];
  const K = (w) => `<span style="color:${TEAL}">${w}</span>`;
  const S = (w) => `<span style="color:${AMBER}">${esc(w)}</span>`;
  const F = (w) => `<span style="color:${BLUE}">${w}</span>`;
  const code = [
    `${F('test')}(${S("'signs in'")}, ${K('async')} ({ page }) =&gt; {`,
    `  ${K('await')} page.${F('goto')}(${S("'/login'")});`,
    `  ${K('await')} page.${F('fill')}(${S("'#email'")}, ${S("'qa@demo.dev'")});`,
    `  ${K('await')} page.${F('fill')}(${S("'#password'")}, ${S("'••••••'")});`,
    `  ${K('await')} page.${F('click')}(${S("'text=Sign in'")});`,
    `  ${K('await')} ${F('expect')}(page)`,
    `    .${F('toHaveURL')}(${S("'/dashboard'")});`,
    `});`,
  ];
  const lineTimes = [0.4, 0.8, 1.6, 3.0, 4.3, 4.8, 5.1, 5.4];
  css.push(`
  .editor{left:50px;top:120px;width:420px;height:440px}
  .tab{position:absolute;left:84px;top:8px;height:26px;padding:0 12px;border-radius:8px;background:#161c24;display:flex;align-items:center;gap:8px}
  .tab span.ic{width:16px;height:16px;display:block}.tab span.ic svg{width:16px;height:16px}
  .code{position:absolute;left:0;top:62px;width:100%;font:400 13px/30px 'SF Mono',monospace;color:${INK}}
  .ln{position:absolute;left:18px;color:${DIM}}
  .cl{position:absolute;left:52px;white-space:pre}
  .hl{position:absolute;left:10px;right:10px;top:62px;height:30px;border-radius:6px;background:${TEAL}1a;${anim('hl')}}
  .term{position:absolute;left:16px;right:16px;bottom:16px;height:66px;border-radius:10px;background:#0b0f14;padding:12px 14px;font:400 12px/20px 'SF Mono',monospace;color:${SUB}}
  .browser{left:500px;top:110px;width:360px;height:460px}
  .field{position:absolute;left:30px;width:300px;height:42px;border-radius:10px;border:1.5px solid #222b36;background:#0b0f14;overflow:hidden}
  .typed{position:absolute;left:14px;top:0;font:400 14px/40px 'SF Mono',monospace;color:${INK};overflow:hidden;white-space:nowrap}
  .f1 .typed{${anim('f1', D, 'steps(11,end)')}}
  .f2 .typed{${anim('f2', D, 'steps(8,end)')}}
  .btn{position:absolute;left:30px;top:316px;width:300px;height:44px;border-radius:10px;background:${TEAL};color:#07090c;font-weight:600;font-size:16px;display:grid;place-items:center;${anim('btn')}}
  .toast{position:absolute;left:30px;top:380px;width:300px;height:44px;border-radius:10px;border:1px solid ${TEAL}66;background:${TEAL}14;display:flex;align-items:center;gap:10px;padding-left:12px;${anim('toast')}}
  .ripple{position:absolute;left:680px;top:448px;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;border:2px solid ${TEAL};opacity:0;${anim('ripple', D, 'ease-out')}}
  .cursor{position:absolute;left:0;top:0;width:26px;height:26px;${anim('cur')}}
  .ado{left:890px;top:130px;width:340px;height:440px}
  .row{position:absolute;left:24px;right:24px;display:flex;align-items:center;gap:12px;height:44px;padding:0 12px;border-radius:10px;background:#141a22}
  .row .dur{margin-left:auto}
  .sum{${anim('sum')}}
  `);
  css.push(kf('hl', [[0, 'transform:translateY(0);opacity:0'], [0.3, 'transform:translateY(0);opacity:0'], [0.4, 'transform:translateY(0);opacity:1'],
    ...lineTimes.map((t, i) => [t, `transform:translateY(${i * 30}px);opacity:1`]), [5.9, 'transform:translateY(210px);opacity:0'], [D, 'transform:translateY(0);opacity:0']]));
  css.push(kf('cur', [[0, 'transform:translate(800px,540px)'], [0.6, 'transform:translate(800px,540px)'], [1.4, 'transform:translate(640px,278px)'],
    [2.6, 'transform:translate(640px,278px)'], [3.0, 'transform:translate(650px,348px)'], [4.0, 'transform:translate(650px,348px)'],
    [4.35, 'transform:translate(676px,442px)'], [4.45, 'transform:translate(676px,442px) scale(.85)'], [4.6, 'transform:translate(676px,442px)'],
    [6.8, 'transform:translate(676px,442px)'], [7.6, 'transform:translate(800px,540px)'], [D, 'transform:translate(800px,540px)']]));
  css.push(kf('f1', [[0, 'width:120px'], [0.3, 'width:0'], [1.6, 'width:0'], [2.5, 'width:120px'], [D, 'width:120px']]));
  css.push(kf('f2', [[0, 'width:80px'], [0.3, 'width:0'], [3.05, 'width:0'], [3.8, 'width:80px'], [D, 'width:80px']]));
  css.push(kf('btn', [[0, 'transform:scale(1)'], [4.4, 'transform:scale(1)'], [4.5, 'transform:scale(.96)'], [4.7, 'transform:scale(1)'], [D, 'transform:scale(1)']]));
  css.push(kf('ripple', [[0, 'transform:scale(.3);opacity:0'], [4.45, 'transform:scale(.3);opacity:.9'], [5.2, 'transform:scale(3.2);opacity:0'], [D, 'transform:scale(3.2);opacity:0']]));
  css.push(restOn('toast', 4.8, 'opacity:0;transform:translateY(8px)', 'opacity:1;transform:translateY(0)'));
  const stages = [['Install dependencies', '14s'], ['Run Playwright tests', '52s'], ['Publish test results', '3s'], ['Publish HTML report', '2s']];
  let rows = '';
  stages.forEach(([name, dur], i) => {
    const t = 5.0 + i * 0.4;
    css.push(checkKf(`st${i}`, t, css));
    css.push(restOn(`du${i}`, t + 0.1, 'opacity:0', 'opacity:1'));
    rows += `<div class="row" style="top:${120 + i * 54}px">${check(`st${i}`)}<span class="s" style="color:${INK}">${name}</span><span class="m dur" style="${anim(`du${i}`)}">${dur}</span></div>`;
  });
  css.push(restOn('sum', 6.8, 'opacity:0', 'opacity:1'));
  css.push(pulseKf('p1', 0.2, 0.5), pulseKf('p2', 4.7, 0.5));
  scenes.project1 = page('project1', css.join(''), `
    <svg class="wires"><path class="wire" d="M470 340 L500 340"/><path class="wire" d="M860 340 L890 340"/>
      <path class="pulse" pathLength="100" style="${anim('p1', D, 'linear')}" d="M470 340 L500 340"/>
      <path class="pulse" pathLength="100" style="${anim('p2', D, 'linear')}" d="M860 340 L890 340"/></svg>
    <div class="panel editor"><div class="dots"><i></i><i></i><i></i></div>
      <div class="tab"><span class="ic">${L.playwright}</span><span class="m" style="color:${INK}">login.spec.ts</span></div>
      <div class="hl"></div>
      <div class="code">${code.map((c, i) => `<div style="position:relative;height:30px"><span class="ln">${i + 1}</span><span class="cl">${c}</span></div>`).join('')}</div>
      <div class="term"><span style="color:${TEAL}">$</span> npx playwright test<br><span style="color:${TEAL}">✓</span> 1 passed (2.4s)</div></div>
    <div class="panel browser"><div class="dots"><i></i><i></i><i></i></div><div class="url">demo.app/login</div>
      <div class="t h" style="left:30px;top:62px;font-size:26px">Sign in</div><div class="t s" style="left:30px;top:96px">Welcome back to the dashboard</div>
      <div class="t s" style="left:30px;top:142px;font-size:14px">Email</div>
      <div class="field f1" style="top:164px"><span class="typed">qa@demo.dev</span></div>
      <div class="t s" style="left:30px;top:220px;font-size:14px">Password</div>
      <div class="field f2" style="top:242px"><span class="typed">••••••••</span></div>
      <div class="btn">Sign in</div>
      <div class="toast">${check('', `style="border-color:${TEAL};background:${TEAL}22"`)}<span class="s" style="color:${INK}">Signed in, opening dashboard</span></div></div>
    <div class="ripple"></div>
    <div class="panel ado"><div class="tile xs" style="left:24px;top:22px">${L.azuredevops}</div>
      <div class="t h" style="left:76px;top:22px">Azure Pipelines</div><div class="t m" style="left:76px;top:48px">main · run #142</div>
      <div class="t cap" style="left:24px;top:92px">Stages</div>
      ${rows}
      <div class="t sum" style="left:24px;top:352px;right:24px;height:52px;border-radius:12px;background:${TEAL}14;border:1px solid ${TEAL}55;padding:0 16px;display:flex;align-items:center;gap:10px">
        <span class="h2">12 tests passed</span><span class="m" style="margin-left:auto">1m 11s</span></div></div>
    <div class="cursor">${ICON.cursor}</div>`);
}

/* 2. Playwright + ZeroStep on Swag Labs: plain-language steps, AI finds the elements. */
{
  const css = [];
  const steps = ['Log in as standard_user', 'Add the Sauce Labs Backpack to the cart', 'Check out and confirm the order'];
  const targets = [
    { l: 600, t: 254, w: 320, h: 42 },
    { l: 816, t: 354, w: 90, h: 34 },
    { l: 600, t: 470, w: 320, h: 44 },
  ];
  css.push(`
  .bubble{position:absolute;left:50px;width:330px;height:84px;border-radius:18px 18px 18px 6px;background:#0e1217;border:1.5px solid rgba(255,255,255,.07);padding:14px 16px}
  .chip{display:inline-block;font:600 11px/20px 'SF Mono',monospace;color:${TEAL};background:${TEAL}1a;border-radius:6px;padding:0 8px}
  .bubble .txt{display:block;margin-top:8px;font-size:17px;color:${INK};white-space:nowrap}
  .zs{left:420px;top:298px}
  .browser{left:560px;top:120px;width:400px;height:470px}
  .field{position:absolute;left:40px;width:320px;height:42px;border-radius:10px;border:1.5px solid #222b36;background:#0b0f14;font:400 14px/40px 'SF Mono',monospace;color:${INK};padding-left:14px}
  .prod{position:absolute;left:40px;top:252px;width:320px;height:76px;border-radius:12px;background:#141a22;display:flex;align-items:center;gap:14px;padding:0 14px}
  .prod .img{width:48px;height:48px;border-radius:10px;background:#1f2731}
  .add{position:absolute;right:14px;top:21px;width:90px;height:34px;border-radius:9px;border:1.5px solid ${TEAL};color:${TEAL};font-size:13px;font-weight:600;display:grid;place-items:center;${anim('add')}}
  .btn{position:absolute;left:40px;top:350px;width:320px;height:44px;border-radius:10px;background:${TEAL};color:#07090c;font-weight:600;font-size:16px;display:grid;place-items:center}
  .cart{position:absolute;right:40px;top:58px;display:flex;align-items:center;gap:6px}
  .badge{width:20px;height:20px;border-radius:50%;background:${RED};color:#fff;font:600 12px/20px 'Calibre';text-align:center;${anim('badge')}}
  .pw{left:908px;top:92px}
  .box{position:absolute;border:2px dashed ${TEAL};border-radius:12px;opacity:0;box-shadow:0 0 18px ${TEAL}55}
  .box .tag{position:absolute;left:-2px;top:-26px;font:600 11px/20px 'SF Mono',monospace;color:#07090c;background:${TEAL};border-radius:6px;padding:0 8px}
  .results{left:1000px;top:170px;width:240px;height:360px}
  .res{position:absolute;left:20px;right:20px;display:flex;align-items:center;gap:10px}
  .warn{width:22px;height:22px;border-radius:50%;border:2px solid ${AMBER};display:grid;place-items:center;flex-shrink:0;font:700 13px/1 'Calibre';color:${AMBER};${anim('warn')}}
  `);
  let bubbles = '';
  steps.forEach((text, i) => {
    const t = 0.5 + i * 1.7;
    css.push(kf(`b${i}`, [[0, 'border-color:rgba(255,255,255,.07);box-shadow:none'], [t, 'border-color:rgba(255,255,255,.07);box-shadow:none'],
      [t + 0.25, `border-color:${TEAL}aa;box-shadow:0 0 24px -6px ${TEAL}`], [t + 1.5, `border-color:${TEAL}aa;box-shadow:0 0 24px -6px ${TEAL}`],
      [t + 1.75, 'border-color:rgba(255,255,255,.07);box-shadow:none'], [D, 'border-color:rgba(255,255,255,.07);box-shadow:none']]));
    css.push(pulseKf(`pb${i}`, t + 0.1, 0.5));
    bubbles += `<div class="bubble" style="top:${170 + i * 110}px;${anim(`b${i}`)}"><span class="chip">await ai()</span><span class="txt">${text}</span></div>`;
    const g = targets[i];
    css.push(`.x${i}{left:${g.l - 6}px;top:${g.t - 6}px;width:${g.w + 12}px;height:${g.h + 12}px;${anim(`x${i}`)}}`);
    css.push(kf(`x${i}`, [[0, 'opacity:0;transform:scale(1.12)'], [t + 0.6, 'opacity:0;transform:scale(1.12)'], [t + 0.85, 'opacity:1;transform:scale(1)'],
      [t + 1.6, 'opacity:1;transform:scale(1)'], [t + 1.85, 'opacity:0;transform:scale(1)'], [D, 'opacity:0;transform:scale(1.12)']]));
  });
  css.push(kf('add', [[0, `background:${TEAL}26`], [0.3, 'background:transparent'], [3.0, 'background:transparent'], [3.2, `background:${TEAL}26`], [D, `background:${TEAL}26`]]));
  css.push(restOn('badge', 3.2, 'opacity:0;transform:scale(.4)', 'opacity:1;transform:scale(1)'));
  css.push(kf('zsGlow', [[0, 'box-shadow:0 16px 36px -16px rgba(0,0,0,.95)'], [0.6, `box-shadow:0 0 30px -4px ${TEAL}88`], [5.2, `box-shadow:0 0 30px -4px ${TEAL}88`], [5.6, 'box-shadow:0 16px 36px -16px rgba(0,0,0,.95)'], [D, 'box-shadow:0 16px 36px -16px rgba(0,0,0,.95)']]));
  const results = ['Log in', 'Add to cart', 'Checkout'];
  let res = '';
  results.forEach((r, i) => {
    css.push(checkKf(`r${i}`, 5.6 + i * 0.35, css));
    res += `<div class="res" style="top:${84 + i * 48}px">${check(`r${i}`)}<span class="s" style="color:${INK}">${r}</span><span class="m" style="margin-left:auto">passed</span></div>`;
  });
  css.push(kf('warn', [[0, 'opacity:1'], [0.3, 'opacity:0'], [6.7, 'opacity:0'], [6.9, 'opacity:1'], [7.05, 'opacity:.35'], [7.2, 'opacity:1'], [D, 'opacity:1']]));
  css.push(pulseKf('pz', 5.3, 0.5));
  const bubblePaths = steps.map((_, i) => `M380 ${212 + i * 110} C400 ${212 + i * 110} 400 340 420 340`);
  scenes.project2 = page('project2', css.join(''), `
    <div class="t m" style="left:50px;top:132px">checkout.spec.js</div>
    <svg class="wires">${bubblePaths.map((d) => `<path class="wire" d="${d}"/>`).join('')}<path class="wire" d="M504 340 L560 340"/><path class="wire" d="M960 340 L1000 340"/>
      ${bubblePaths.map((d, i) => `<path class="pulse" pathLength="100" style="${anim(`pb${i}`, D, 'linear')}" d="${d}"/>`).join('')}
      <path class="pulse" pathLength="100" style="${anim('pz', D, 'linear')}" d="M960 340 L1000 340"/></svg>
    ${bubbles}
    <div class="tile zs" style="${anim('zsGlow')}">${ICON.sparkle}</div><div class="t h2" style="left:420px;top:392px;width:84px;text-align:center">ZeroStep</div>
    <div class="panel browser"><div class="dots"><i></i><i></i><i></i></div><div class="url">saucedemo.com</div>
      <div class="t h" style="left:40px;top:56px;font-size:24px">Swag Labs</div>
      <div class="cart"><span class="m" style="color:${INK}">Cart</span><span class="badge">1</span></div>
      <div class="t s" style="left:40px;top:112px;font-size:14px">Username</div>
      <div class="field" style="top:134px">standard_user</div>
      <div class="t s" style="left:40px;top:186px;font-size:14px">Products</div>
      <div class="prod" style="top:212px"><div class="img"></div><div><div class="h2" style="font-size:15px">Sauce Labs Backpack</div><div class="m">$29.99</div></div><div class="add">Add to cart</div></div>
      <div class="btn">Checkout</div>
      <div class="t m" style="left:40px;top:420px">Order total: $32.39</div></div>
    <div class="tile xs pw">${L.playwright}</div>
    ${targets.map((_, i) => `<div class="box x${i}"><span class="tag">${['type', 'click', 'click'][i]}</span></div>`).join('')}
    <div class="panel results"><div class="t h" style="left:20px;top:22px">Test results</div><div class="t m" style="left:20px;top:50px">chromium · 21s</div>
      ${res}
      <div class="res" style="top:228px"><span class="warn">!</span><span class="s" style="color:${INK}">Order total</span><span class="m" style="margin-left:auto;color:${AMBER}">warning</span></div>
      <div class="t" style="left:20px;right:20px;top:290px;height:44px;border-radius:10px;background:#141a22;display:flex;align-items:center;padding:0 14px"><span class="s" style="color:${INK}">3 passed · 1 warning</span></div></div>`);
}

/* 3. JMeter -> InfluxDB -> Grafana: live load-test metrics on a dashboard. */
{
  const css = [];
  const lanes = ['M310 290 C400 290 430 330 520 345', 'M310 365 C400 365 430 360 520 362', 'M310 440 C400 440 430 395 520 379'];
  const out = 'M650 362 C690 362 700 330 740 330';
  let parts = '';
  lanes.forEach((d, li) => {
    for (let k = 0; k < 4; k += 1) {
      parts += `<span class="p" style="offset-path:path('${d}');animation:flow 2s linear ${-(k * 0.5 + li * 0.17)}s infinite"></span>`;
    }
  });
  for (let k = 0; k < 4; k += 1) parts += `<span class="p" style="offset-path:path('${out}');animation:flow 2s linear ${-(k * 0.5 + 0.25)}s infinite"></span>`;
  css.push(`
  .jm{left:40px;top:170px;width:270px;height:380px}
  .thread{position:absolute;left:20px;right:20px}
  .thread .blocks{display:flex;gap:5px;margin-top:8px}
  .thread .blocks i{width:14px;height:20px;border-radius:4px;background:#1c242e;display:block}
  .thread .blocks i.on{background:${TEAL}88}
  .p{position:absolute;left:0;top:0;width:7px;height:7px;margin:-3.5px;border-radius:50%;background:${TEAL};box-shadow:0 0 10px ${TEAL};offset-rotate:0deg}
  .db{position:absolute;left:520px;top:290px;width:130px;height:160px}
  .graf{left:740px;top:110px;width:490px;height:500px}
  .stat{position:absolute;top:84px;width:140px;height:76px;border-radius:12px;background:#141a22;padding:12px 14px}
  .stat .v{font-weight:600;font-size:24px;color:${INK};margin-top:4px}
  .chart{position:absolute;left:20px;top:178px;width:450px;height:150px;border-radius:12px;background:#0a0e13;overflow:hidden}
  .wave{position:absolute;left:0;top:0;${anim('scroll', D, 'linear')}}
  .legend{position:absolute;left:20px;top:338px;display:flex;gap:18px}
  .legend span{display:flex;align-items:center;gap:6px}
  .legend i{width:12px;height:3px;border-radius:2px;display:block}
  .bars2{position:absolute;left:20px;top:400px;display:flex;align-items:flex-end;gap:9px;height:76px}
  .bars2 i{width:20px;border-radius:5px 5px 2px 2px;background:${BLUE}77;display:block;transform-origin:bottom}
  .gauge{position:absolute;left:320px;top:372px;width:150px;height:110px}
  .needle{transform-origin:75px 86px;${anim('needle', 4, 'ease-in-out')}}
  @keyframes flow{0%{offset-distance:0%;opacity:0}10%{opacity:1}90%{opacity:1}100%{offset-distance:100%;opacity:0}}
  @keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-450px)}}
  @keyframes needle{0%{transform:rotate(-50deg)}50%{transform:rotate(30deg)}100%{transform:rotate(-50deg)}}
  @keyframes ring{0%,100%{stroke:${TEAL}55}50%{stroke:${TEAL}}}
  @keyframes grow{0%,100%{transform:scaleY(.55)}50%{transform:scaleY(1)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}
  `);
  // periodic waveform (period 225px), drawn over 3 periods so it scrolls seamlessly
  const pts = [];
  for (let x = 0; x <= 1350; x += 6) {
    const p = (x % 225) / 225;
    pts.push(`${x},${(80 - 34 * Math.sin(p * Math.PI * 2) - 16 * Math.sin(p * Math.PI * 6 + 1)).toFixed(1)}`);
  }
  const pts2 = pts.map((s) => { const [x, y] = s.split(','); return `${x},${(+y + 30).toFixed(1)}`; });
  const threads = [['Login', 9], ['Search', 7], ['Checkout', 5]];
  const statTiles = [['p95 response', '320 ms'], ['Throughput', '142 req/s'], ['Error rate', '0.4%']];
  const barH = [40, 62, 34, 70, 52, 66, 44, 72, 58];
  scenes.project3 = page('project3', css.join(''), `
    <svg class="wires">${lanes.map((d) => `<path class="wire" d="${d}"/>`).join('')}<path class="wire" d="${out}"/></svg>
    <div class="panel jm"><div class="tile xs plate" style="left:20px;top:20px">${L.jmeter}</div>
      <div class="t h2" style="left:72px;top:18px">Thread Group</div><div class="t m" style="left:72px;top:42px">50 users · ramp-up 30s</div>
      ${threads.map(([n, on], r) => `<div class="thread" style="top:${92 + r * 74}px"><span class="s" style="color:${INK}">${n}</span><div class="blocks">${Array.from({ length: 10 }, (_, k) => `<i class="${k < on ? 'on' : ''}" style="animation:blink ${[2, 1, 2][r]}s ease-in-out ${-k * 0.2}s infinite"></i>`).join('')}</div></div>`).join('')}
      <div class="t" style="left:20px;right:20px;bottom:18px;height:40px;border-radius:10px;background:#141a22;display:flex;align-items:center;gap:8px;padding:0 12px">
        <span style="width:8px;height:8px;border-radius:50%;background:${TEAL};display:block"></span><span class="m" style="color:${INK}">Backend Listener</span></div></div>
    ${parts}
    <svg class="db" viewBox="0 0 130 160"><path d="M5 26 v104 a60 22 0 0 0 120 0 v-104" fill="#0e1217" stroke="#232c37" stroke-width="1.5"/>
      ${[26, 68, 110].map((y, i) => `<ellipse cx="65" cy="${y}" rx="60" ry="22" fill="${i === 0 ? '#121821' : 'none'}" stroke="${TEAL}55" stroke-width="1.5" style="animation:ring 2s ease-in-out ${-i * 0.66}s infinite"/>`).join('')}</svg>
    <div class="tile xs" style="left:565px;top:250px">${L.influxdb}</div>
    <div class="t h2" style="left:520px;top:466px;width:130px;text-align:center">InfluxDB</div><div class="t m" style="left:520px;top:490px;width:130px;text-align:center">bucket: jmeter</div>
    <div class="panel graf"><div class="tile xs" style="left:20px;top:20px">${L.grafana}</div>
      <div class="t h2" style="left:72px;top:18px">JMeter Load Test</div><div class="t m" style="left:72px;top:42px">Last 15 minutes · refresh 5s</div>
      ${statTiles.map(([k, v], i) => `<div class="stat" style="left:${20 + i * 155}px"><div class="cap">${k}</div><div class="v">${v}</div></div>`).join('')}
      <div class="chart"><svg class="wave" width="1350" height="150"><polyline points="${pts2.join(' ')}" fill="none" stroke="${BLUE}99" stroke-width="2"/>
        <polyline points="${pts.join(' ')}" fill="none" stroke="${TEAL}" stroke-width="2.5"/></svg></div>
      <div class="legend"><span><i style="background:${TEAL}"></i><span class="m">Response time</span></span><span><i style="background:${BLUE}"></i><span class="m">Throughput</span></span></div>
      <div class="t cap" style="left:20px;top:378px">Requests per sampler</div>
      <div class="bars2">${barH.map((h, i) => `<i style="height:${h}px;animation:grow ${[2, 4][i % 2]}s ease-in-out ${-i * 0.37}s infinite"></i>`).join('')}</div>
      <div class="t cap" style="left:340px;top:378px">CPU</div>
      <svg class="gauge" viewBox="0 0 150 110"><path d="M12 86 A63 63 0 0 1 138 86" fill="none" stroke="#1f2731" stroke-width="10" stroke-linecap="round"/>
        <path d="M12 86 A63 63 0 0 1 108 34" fill="none" stroke="${TEAL}" stroke-width="10" stroke-linecap="round"/>
        <g class="needle"><path d="M75 86 L75 34" stroke="#e8edf3" stroke-width="3" stroke-linecap="round"/></g><circle cx="75" cy="86" r="6" fill="#e8edf3"/></svg></div>`);
}

/* 4. Selenium + TestNG + Maven + Jenkins: a framework stack, scanned bottom to top. */
{
  const css = [];
  const slabs = [
    { top: 476, icon: ICON.layers, title: 'Test foundation', seg: ['BaseTest', 'Config', 'Utilities'] },
    { top: 372, icon: L.selenium, title: 'Selenium WebDriver', seg: ['LoginPage', 'CartPage', 'CheckoutPage'] },
    { top: 268, icon: L.maven, icon2: ICON.flask, title: 'Maven + TestNG', seg: ['pom.xml', 'testng.xml', 'Suites'] },
    { top: 164, icon: L.jenkins, title: 'Jenkins pipeline', seg: ['Checkout', 'Build', 'Test', 'Report', 'Notify'], jen: true },
  ];
  css.push(`
  .slab{position:absolute;left:60px;width:620px;height:92px;border-radius:16px;background:#0e1217;border:1px solid rgba(255,255,255,.07);box-shadow:0 18px 40px -20px rgba(0,0,0,.95)}
  .slab .tile{left:14px;top:18px;box-shadow:none}
  .seg{position:absolute;top:46px;height:30px;border-radius:8px;background:#151b23;border:1px solid #1d252f;font:400 12px/28px 'SF Mono',monospace;color:${SUB};text-align:center}
  .scan{position:absolute;left:46px;width:648px;height:2px;background:${TEAL};box-shadow:0 0 16px ${TEAL};top:0;${anim('scan')}}
  .report{left:720px;top:150px;width:500px;height:430px}
  .donut{position:absolute;left:24px;top:96px;width:170px;height:170px}
  .legend{position:absolute;left:220px;top:110px}
  .legend div{display:flex;align-items:center;gap:10px;height:34px}
  .legend i{width:10px;height:10px;border-radius:3px;display:block}
  .rbars{position:absolute;left:24px;top:322px;display:flex;align-items:flex-end;gap:12px;height:80px}
  .rbars i{width:30px;border-radius:5px 5px 2px 2px;background:${TEAL}aa;display:block;transform-origin:bottom}
  `);
  css.push(kf('scan', [[0, 'transform:translateY(580px);opacity:0'], [0.3, 'transform:translateY(580px);opacity:0'], [0.5, 'transform:translateY(570px);opacity:1'],
    [2.8, 'transform:translateY(162px);opacity:1'], [3.0, 'transform:translateY(158px);opacity:0'], [D, 'transform:translateY(580px);opacity:0']]));
  let body = '';
  slabs.forEach((s, si) => {
    const tLit = 0.6 + (3 - si) * 0.55;
    let x = s.icon2 ? 136 : 80;
    const w = s.jen ? 92 : 150;
    const segs = s.seg.map((label, gi) => {
      const name = `g${si}_${gi}`;
      const t = s.jen ? 3.1 + gi * 0.42 : tLit + gi * 0.12;
      css.push(restOn(name, t, `background:#151b23;border-color:#1d252f;color:${SUB}`, `background:${TEAL}${s.jen ? '30' : '1c'};border-color:${TEAL}${s.jen ? 'cc' : '66'};color:${INK}`));
      const el = `<div class="seg" style="left:${x}px;width:${w}px;${anim(name)}">${label}</div>${s.jen && gi < 4 ? `<svg style="position:absolute;left:${x + w + 1}px;top:55px;width:12px;height:12px" viewBox="0 0 12 12"><path d="M2 6h8M7 3l3 3-3 3" stroke="#3a4552" stroke-width="1.6" fill="none"/></svg>` : ''}`;
      x += w + (s.jen ? 14 : 12);
      return el;
    }).join('');
    body += `<div class="slab" style="top:${s.top}px"><div class="tile xs">${s.icon}</div>${s.icon2 ? `<div class="tile xs" style="left:68px">${s.icon2}</div>` : ''}
      <div class="t h2" style="left:${s.icon2 ? 136 : 80}px;top:14px">${s.title}</div>${segs}</div>`;
  });
  css.push(`.dfill{${anim('donut')}}`);
  css.push(kf('donut', [[0, 'stroke-dashoffset:8'], [0.4, 'stroke-dashoffset:100'], [5.3, 'stroke-dashoffset:100'], [6.5, 'stroke-dashoffset:8'], [D, 'stroke-dashoffset:8']]));
  const rb = [52, 76, 40, 68, 60, 30];
  rb.forEach((h, i) => css.push(kf(`rb${i}`, [[0, 'transform:scaleY(1)'], [0.4, 'transform:scaleY(.15)'], [5.5 + i * 0.12, 'transform:scaleY(.15)'], [6.4 + i * 0.12, 'transform:scaleY(1)'], [D, 'transform:scaleY(1)']])));
  css.push(pulseKf('pr', 5.0, 0.5));
  scenes.project4 = page('project4', css.join(''), `
    <svg class="wires"><path class="wire" d="M680 210 C700 210 700 220 720 220"/><path class="pulse" pathLength="100" style="${anim('pr', D, 'linear')}" d="M680 210 C700 210 700 220 720 220"/></svg>
    ${body}<div class="scan"></div>
    <div class="panel report"><div class="tile xs" style="left:24px;top:22px">${ICON.report}</div>
      <div class="t h" style="left:76px;top:20px">Allure Report</div><div class="t m" style="left:76px;top:46px">Jenkins build #58 · 50 tests</div>
      <svg class="donut" viewBox="0 0 42 42"><circle cx="21" cy="21" r="15.9" fill="none" stroke="#1f2731" stroke-width="5"/>
        <circle class="dfill" cx="21" cy="21" r="15.9" fill="none" stroke="${TEAL}" stroke-width="5" pathLength="100" stroke-dasharray="100" stroke-dashoffset="8" transform="rotate(-90 21 21)"/>
        <circle cx="21" cy="21" r="15.9" fill="none" stroke="${RED}" stroke-width="5" pathLength="100" stroke-dasharray="4 96" stroke-dashoffset="-92" transform="rotate(-90 21 21)"/>
        <circle cx="21" cy="21" r="15.9" fill="none" stroke="${AMBER}" stroke-width="5" pathLength="100" stroke-dasharray="4 96" stroke-dashoffset="-96" transform="rotate(-90 21 21)"/></svg>
      <div class="t" style="left:24px;top:162px;width:170px;text-align:center"><div class="h" style="font-size:30px">92%</div><div class="m">passed</div></div>
      <div class="legend"><div><i style="background:${TEAL}"></i><span class="s" style="color:${INK}">Passed</span><span class="m" style="margin-left:auto;padding-left:40px">46</span></div>
        <div><i style="background:${RED}"></i><span class="s" style="color:${INK}">Failed</span><span class="m" style="margin-left:auto;padding-left:40px">2</span></div>
        <div><i style="background:${AMBER}"></i><span class="s" style="color:${INK}">Skipped</span><span class="m" style="margin-left:auto;padding-left:40px">2</span></div>
        <div><span class="m">Duration</span><span class="m" style="margin-left:auto;padding-left:40px;color:${INK}">4m 12s</span></div></div>
      <div class="t cap" style="left:24px;top:296px">Duration by suite</div>
      <div class="rbars">${rb.map((h, i) => `<i style="height:${h}px;${anim(`rb${i}`)}"></i>`).join('')}</div></div>`);
}

/* 5. Basics of performance testing: four load shapes, the server reacts. */
{
  const css = [];
  const W = 250;
  const H = 96;
  const shapes = [
    { title: 'Load test', sub: 'Expected traffic', d: `M0 ${H} L80 34 L${W} 34`, color: TEAL },
    { title: 'Stress test', sub: 'Past the limit', d: `M0 ${H} L45 ${H} L45 74 L100 74 L100 50 L160 50 L160 22 L${W} 22`, color: TEAL },
    { title: 'Spike test', sub: 'Sudden surge', d: `M0 80 L115 80 L130 6 L145 80 L${W} 80`, color: RED },
    { title: 'Soak test', sub: 'Hours at steady load', d: `M0 56 C40 50 80 62 125 56 S210 50 ${W} 56`, color: BLUE },
  ];
  const pos = [[50, 100], [365, 100], [50, 380], [365, 380]];
  css.push(`
  .card{position:absolute;width:300px;height:250px}
  .plot{position:absolute;left:25px;top:110px;overflow:visible}
  .rack{left:700px;top:130px;width:230px;height:460px}
  .unit{position:absolute;left:18px;width:194px;height:104px;border-radius:12px;background:#121821;border:1px solid #1d252f}
  .led{position:absolute;top:44px;width:9px;height:9px;border-radius:50%;background:${TEAL}}
  .gauge{left:960px;top:130px;width:270px;height:220px}
  .rt{left:960px;top:370px;width:270px;height:220px}
  .needle{transform-origin:135px 132px;${anim('nd')}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
  `);
  let body = '<svg class="wires"><path class="wire" d="M665 350 L700 350"/></svg>';
  shapes.forEach((s, i) => {
    const t = 0.4 + i * 1.6;
    css.push(`.tr${i}{${anim(`tr${i}`)}}.hd${i}{offset-path:path('${s.d}');${anim(`hd${i}`)}}`);
    css.push(kf(`tr${i}`, [[0, 'stroke-dashoffset:100;opacity:0'], [t, 'stroke-dashoffset:100;opacity:1'], [t + 1.4, 'stroke-dashoffset:0;opacity:1'], [t + 1.8, 'stroke-dashoffset:0;opacity:0'], [D, 'stroke-dashoffset:0;opacity:0']]));
    css.push(kf(`hd${i}`, [[0, 'offset-distance:0%;opacity:0'], [t, 'offset-distance:0%;opacity:1'], [t + 1.4, 'offset-distance:100%;opacity:1'], [t + 1.6, 'offset-distance:100%;opacity:0'], [D, 'offset-distance:100%;opacity:0']]));
    const [x, y] = pos[i];
    body += `<div class="panel card" style="left:${x}px;top:${y}px">
      <span style="position:absolute;left:24px;top:30px;width:10px;height:10px;border-radius:50%;background:${s.color}"></span>
      <div class="t h2" style="left:44px;top:22px">${s.title}</div><div class="t s" style="left:44px;top:46px">${s.sub}</div>
      <div class="t cap" style="left:25px;top:86px">users</div><div class="t cap" style="right:25px;top:216px">time</div>
      <svg class="plot" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><path d="M0 ${H + 0.5}H${W}" stroke="#1d252f" stroke-width="1.5"/>
        <path d="${s.d}" fill="none" stroke="${s.color}99" stroke-width="2.5" stroke-linejoin="round"/>
        <path class="tr${i}" d="${s.d}" pathLength="100" fill="none" stroke="${s.color}" stroke-width="3" stroke-linejoin="round" stroke-dasharray="100" style="filter:drop-shadow(0 0 6px ${s.color})"/></svg>
      <span class="hd${i}" style="position:absolute;left:25px;top:110px;width:10px;height:10px;margin:-5px;border-radius:50%;background:#fff;box-shadow:0 0 12px ${s.color};offset-rotate:0deg"></span></div>`;
  });
  css.push(kf('hot', [[0, 'border-color:rgba(255,255,255,.07);box-shadow:0 24px 60px -24px rgba(0,0,0,.9)'], [3.9, 'border-color:rgba(255,255,255,.07);box-shadow:0 24px 60px -24px rgba(0,0,0,.9)'],
    [4.4, `border-color:${RED}aa;box-shadow:0 0 40px -8px ${RED}`], [4.9, `border-color:${RED}aa;box-shadow:0 0 40px -8px ${RED}`], [5.4, 'border-color:rgba(255,255,255,.07);box-shadow:0 24px 60px -24px rgba(0,0,0,.9)'], [D, 'border-color:rgba(255,255,255,.07);box-shadow:0 24px 60px -24px rgba(0,0,0,.9)']]));
  css.push(kf('ledhot', [[0, `background:${TEAL}`], [3.9, `background:${TEAL}`], [4.3, `background:${RED}`], [4.9, `background:${RED}`], [5.4, `background:${TEAL}`], [D, `background:${TEAL}`]]));
  css.push(kf('nd', [[0, 'transform:rotate(-60deg)'], [0.4, 'transform:rotate(-60deg)'], [1.8, 'transform:rotate(-10deg)'], [3.4, 'transform:rotate(30deg)'], [4.4, 'transform:rotate(62deg)'], [5.0, 'transform:rotate(-20deg)'], [7.4, 'transform:rotate(-20deg)'], [D, 'transform:rotate(-60deg)']]));
  const leds = (u) => [0, 1, 2, 3, 4].map((k) => `<span class="led" style="left:${18 + k * 18}px;animation:blink ${[1, 2, 0.5, 1, 2][k]}s steps(2,jump-none) ${-(u * 0.3 + k * 0.2)}s infinite, ledhot 8s linear 0s infinite"></span>`).join('');
  body += `<div class="panel rack" style="${anim('hot')}"><div class="tile xs plate" style="left:20px;top:20px">${L.jmeter}</div>
    <div class="t h2" style="left:72px;top:18px">App servers</div><div class="t m" style="left:72px;top:42px">under test</div>
    ${['web-01', 'web-02', 'db-01'].map((n, u) => `<div class="unit" style="top:${96 + u * 118}px"><div class="t m" style="left:18px;top:14px;color:${INK}">${n}</div>${leds(u)}
      <div class="bar" style="position:absolute;left:18px;top:74px;width:150px;background:#1a222b"></div></div>`).join('')}</div>`;
  body += `<div class="panel gauge"><div class="t h2" style="left:22px;top:18px">CPU usage</div>
    <svg style="position:absolute;left:0;top:40px" viewBox="0 0 270 170" width="270" height="170"><path d="M45 132 A90 90 0 0 1 225 132" fill="none" stroke="#1f2731" stroke-width="14" stroke-linecap="round"/>
    <path d="M45 132 A90 90 0 0 1 135 42" fill="none" stroke="${TEAL}" stroke-width="14" stroke-linecap="round"/><path d="M135 42 A90 90 0 0 1 199 68" fill="none" stroke="${AMBER}" stroke-width="14" stroke-linecap="round"/>
    <path d="M199 68 A90 90 0 0 1 225 132" fill="none" stroke="${RED}" stroke-width="14" stroke-linecap="round"/>
    <g class="needle"><path d="M135 132 L135 60" stroke="#e8edf3" stroke-width="4" stroke-linecap="round"/></g><circle cx="135" cy="132" r="8" fill="#e8edf3"/></svg></div>`;
  body += `<div class="panel rt"><div class="t h2" style="left:22px;top:18px">Response time</div><div class="t m" style="left:22px;top:42px">p95, ms</div>
    <svg style="position:absolute;left:0;top:60px" width="270" height="150" viewBox="0 0 270 150"><path d="M22 120H248M22 80H248M22 40H248" stroke="#1d252f" stroke-width="1"/>
    <polyline points="22,110 60,104 98,108 136,92 158,22 178,98 214,100 248,94" fill="none" stroke="${BLUE}" stroke-width="2.5" stroke-linejoin="round"/></svg>
    <div class="t m" style="right:22px;top:72px;color:${RED}">peak 1.8s</div></div>`;
  scenes.project5 = page('project5', css.join(''), body);
}

/* 6. AIO Tests + GitHub Actions + Playwright: a loop that syncs results back. */
{
  const css = [];
  const C = { x: 820, y: 370, r: 190 };
  const ring = `M ${C.x - C.r} ${C.y} a ${C.r} ${C.r} 0 1 1 ${2 * C.r} 0 a ${C.r} ${C.r} 0 1 1 ${-2 * C.r} 0`;
  const nodes = [
    { x: C.x, y: C.y - C.r, icon: L.githubactions, t: 2.0, label: 'GitHub Actions', sub: 'workflow run', above: true },
    { x: C.x + C.r, y: C.y, icon: L.playwright, t: 4.0, label: 'Playwright', sub: '24 tests' },
    { x: C.x, y: C.y + C.r, icon: ICON.check, t: 6.0, label: 'Results synced', sub: 'to AIO Tests' },
  ];
  css.push(`
  .board{left:40px;top:150px;width:380px;height:440px}
  .col{position:absolute;top:110px;width:108px}
  .card{position:absolute;left:0;width:108px;height:58px;border-radius:10px;background:#141a22;border:1px solid #1d252f;padding:8px 10px}
  .card .id{font:600 11px/16px 'SF Mono',monospace;color:${SUB}}
  .card .nm{font-size:14px;color:${INK};margin-top:2px}
  .token{position:absolute;left:0;top:0;width:16px;height:16px;margin:-8px;border-radius:50%;background:${TEAL};box-shadow:0 0 18px ${TEAL};offset-path:path('${ring}');offset-rotate:0deg;${anim('orbit', D, 'linear')}}
  .mover{position:absolute;${anim('mv')}}
  @keyframes orbit{from{offset-distance:0%}to{offset-distance:100%}}
  `);
  nodes.forEach((n, i) => {
    css.push(kf(`n${i}`, [[0, 'box-shadow:0 16px 36px -16px rgba(0,0,0,.95);border-color:rgba(255,255,255,.09)'], [n.t - 0.3, 'box-shadow:0 16px 36px -16px rgba(0,0,0,.95);border-color:rgba(255,255,255,.09)'],
      [n.t, `box-shadow:0 0 34px -4px ${TEAL};border-color:${TEAL}`], [n.t + 0.6, 'box-shadow:0 16px 36px -16px rgba(0,0,0,.95);border-color:rgba(255,255,255,.09)'], [D, 'box-shadow:0 16px 36px -16px rgba(0,0,0,.95);border-color:rgba(255,255,255,.09)']]));
  });
  css.push(kf('mv', [[0, 'transform:translate(0,0);opacity:1'], [0.2, 'transform:translate(0,0);opacity:1'], [1.0, 'transform:translate(118px,-4px);opacity:1'],
    [6.6, 'transform:translate(118px,-4px);opacity:1'], [7.4, 'transform:translate(236px,0);opacity:1'], [7.7, 'transform:translate(236px,0);opacity:0'], [7.75, 'transform:translate(0,0);opacity:0'], [D, 'transform:translate(0,0);opacity:1']]));
  css.push(kf('mvc', [[0, 'border-color:#1d252f'], [0.2, `border-color:${AMBER}aa`], [6.6, `border-color:${AMBER}aa`], [7.2, `border-color:${TEAL}`], [7.7, `border-color:${TEAL}`], [7.75, 'border-color:#1d252f'], [D, 'border-color:#1d252f']]));
  css.push(pulseKf('pl', 7.5, 0.4));
  const cols = [
    { name: 'To do', color: AMBER, cards: [['TC-105', 'Profile'], ['TC-106', 'Logout']] },
    { name: 'Running', color: BLUE, cards: [['TC-103', 'Cart'], ['TC-104', 'Search']] },
    { name: 'Passed', color: TEAL, cards: [['TC-101', 'Login'], ['TC-102', 'Sign up']] },
  ];
  const colsHtml = cols.map((c, ci) => `<div class="t cap" style="left:${20 + ci * 118}px;top:84px">${c.name}</div>
    <div class="bar" style="position:absolute;left:${20 + ci * 118}px;top:102px;width:${[44, 60, 52][ci]}px;height:3px;background:${c.color}"></div>
    <div class="col" style="left:${20 + ci * 118}px">${c.cards.map(([id, nm], k) => `<div class="card" style="top:${10 + k * 68}px"><div class="id">${id}</div><div class="nm">${nm}</div></div>`).join('')}</div>`).join('');
  scenes.project6 = page('project6', css.join(''), `
    <svg class="wires"><circle cx="${C.x}" cy="${C.y}" r="${C.r}" fill="none" stroke="#1b222b" stroke-width="2" stroke-dasharray="4 8"/>
      <path class="wire" d="M420 370 L${C.x - C.r} ${C.y}"/>
      <path class="pulse" pathLength="100" style="${anim('pl', D, 'linear')}" d="M${C.x - C.r} ${C.y} L420 370"/></svg>
    <div class="panel board"><div class="tile xs" style="left:20px;top:20px">${ICON.board}</div>
      <div class="t h2" style="left:72px;top:18px">AIO Tests</div><div class="t m" style="left:72px;top:42px">Cycle: Sprint 24 regression</div>
      ${colsHtml}
      <div class="mover" style="left:20px;top:256px"><div class="card" style="position:relative;${anim('mvc')}"><div class="id">TC-107</div><div class="nm">Checkout</div></div></div>
      <div class="t" style="left:20px;right:20px;bottom:18px;height:40px;border-radius:10px;background:#141a22;display:flex;align-items:center;padding:0 12px;gap:8px"><span class="m" style="color:${INK}">Linked to Jira</span><span class="m" style="margin-left:auto">PROJ-482</span></div></div>
    <div class="t" style="left:${C.x - 100}px;top:${C.y - 26}px;width:200px;text-align:center"><div class="h2">CI run #87</div><div class="m">on push to main</div></div>
    ${nodes.map((n, i) => `<div class="tile" style="left:${n.x - 42}px;top:${n.y - 42}px;${anim(`n${i}`)}">${n.icon}</div>
      <div class="t" style="left:${n.x - 90}px;top:${n.above ? n.y - 96 : n.y + 50}px;width:180px;text-align:center"><div class="h2" style="font-size:15px">${n.label}</div><div class="m" style="font-size:13px">${n.sub}</div></div>`).join('')}
    <div class="tile xs" style="left:${C.x - C.r - 20}px;top:${C.y - 20}px;border-radius:50%">${ICON.board}</div>
    <div class="token"></div>`);
}

/* 7. TestPilot AI: requirements in, test cases grouped by technique, exported to AIO Tests. */
{
  const css = [];
  const core = { x: 460, y: 360 };
  const cols = [
    { x: 620, title: 'Boundary Value Analysis', color: TEAL, cases: ['Min length', 'Max length', 'Below minimum', 'Above maximum'] },
    { x: 820, title: 'Equivalence Partitioning', color: AMBER, cases: ['Valid email', 'Invalid format', 'Empty input', 'Unicode name'] },
    { x: 1020, title: 'Decision Tables', color: BLUE, cases: ['All rules met', 'Expired card', 'Wrong CVV', 'Limit exceeded'] },
  ];
  css.push(`
  .doc{position:absolute;width:244px;height:104px;white-space:nowrap;border-radius:12px;background:#0e1217;border:1px solid rgba(255,255,255,.08);box-shadow:0 18px 40px -20px rgba(0,0,0,.95);padding:12px 14px}
  .doc .bar{margin-top:9px}
  .core{position:absolute;left:${core.x - 78}px;top:${core.y - 78}px;width:156px;height:156px;border-radius:50%;background:radial-gradient(circle,#152029 0%,#0d1218 70%);
    border:1px solid ${TEAL}55;display:grid;place-items:center;${anim('coreGlow')}}
  .core svg.logo{width:60px;height:60px}
  .ringd{position:absolute;left:${core.x - 98}px;top:${core.y - 98}px;width:196px;height:196px;${anim('spin', D, 'linear')}}
  .tc{position:absolute;width:180px;height:58px;border-radius:12px;background:#0e1217;border:1px solid rgba(255,255,255,.08);padding:9px 12px}
  .tc .id{font:600 11px/16px 'SF Mono',monospace;color:${SUB}}
  .tc .nm{font-size:15px;color:${INK};margin-top:3px}
  .tc .pr{position:absolute;right:10px;top:10px;font:600 10px/16px 'SF Mono',monospace;border-radius:5px;padding:0 6px}
  .exp{left:820px;top:584px;width:380px;height:72px}
  @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
  `);
  css.push(kf('coreGlow', [[0, `box-shadow:0 0 0 0 ${TEAL}00`], [1.6, `box-shadow:0 0 0 0 ${TEAL}00`], [2.4, `box-shadow:0 0 60px 6px ${TEAL}55`], [3.4, `box-shadow:0 0 60px 6px ${TEAL}55`], [4.4, `box-shadow:0 0 20px 0 ${TEAL}22`], [D, `box-shadow:0 0 0 0 ${TEAL}00`]]));
  let body = '';
  const docs = [[40, 170, 'requirements.pdf', 'PDF'], [60, 300, 'PROJ-214', 'Jira story'], [40, 430, 'checkout-rules.docx', 'DOCX']];
  docs.forEach(([x, y, name, kind], i) => {
    const dx = core.x - (x + 122);
    const dy = core.y - (y + 52);
    css.push(kf(`d${i}`, [[0, 'transform:translate(0,0) scale(1);opacity:1'], [0.5 + i * 0.25, 'transform:translate(0,0) scale(1);opacity:1'],
      [1.4 + i * 0.25, `transform:translate(${dx}px,${dy}px) scale(.3);opacity:0`], [1.5 + i * 0.25, `transform:translate(${dx}px,${dy}px) scale(.3);opacity:0`],
      [1.55 + i * 0.25, 'transform:translate(-30px,0) scale(1);opacity:0'], [2.6 + i * 0.25, 'transform:translate(0,0) scale(1);opacity:1'], [D, 'transform:translate(0,0) scale(1);opacity:1']]));
    body += `<div class="doc" style="left:${x}px;top:${y}px;${anim(`d${i}`)}">
      <div style="display:flex;align-items:center;gap:8px">${i === 1 ? `<span style="width:18px;height:18px;display:block">${L.jira}</span>` : ''}<span class="m" style="color:${INK}">${name}</span><span class="cap" style="margin-left:auto">${kind}</span></div>
      ${[0, 1, 2].map((r) => `<div class="bar" style="width:${[150, 120, 136][(r + i) % 3]}px;${r === 0 ? 'background:#2a3440' : ''}"></div>`).join('')}</div>`;
  });
  const prio = [['High', RED], ['Med', AMBER], ['Low', BLUE]];
  let n = 1;
  cols.forEach((c, ci) => {
    body += `<div class="t" style="left:${c.x}px;top:116px;display:flex;align-items:center;gap:8px"><span style="width:10px;height:10px;border-radius:3px;background:${c.color};display:block"></span><span class="h2" style="font-size:15px">${c.title}</span></div>`;
    c.cases.forEach((name, r) => {
      const x = c.x;
      const y = 150 + r * 68;
      const dx = core.x - (x + 90);
      const dy = core.y - (y + 29);
      const k = ci * 4 + r;
      const tOut = 0.3 + k * 0.04;
      const tIn = 3.2 + (r * 3 + ci) * 0.18;
      css.push(kf(`c${k}`, [[0, 'transform:translate(0,0) scale(1);opacity:1'], [tOut, 'transform:translate(0,0) scale(1);opacity:1'],
        [tOut + 0.6, `transform:translate(${dx}px,${dy}px) scale(.2);opacity:0`], [tIn, `transform:translate(${dx}px,${dy}px) scale(.2);opacity:0`],
        [tIn + 0.55, 'transform:translate(0,0) scale(1);opacity:1'], [D, 'transform:translate(0,0) scale(1);opacity:1']]));
      const [p, pc] = prio[(r + ci) % 3];
      body += `<div class="tc" style="left:${x}px;top:${y}px;${anim(`c${k}`, D, 'cubic-bezier(.3,0,.2,1)')}"><div class="id">TC-${String(n).padStart(3, '0')}</div><div class="nm">${name}</div>
        <span class="pr" style="color:${pc};background:${pc}22">${p}</span></div>`;
      n += 1;
    });
  });
  css.push(kf('expGlow', [[0, 'border-color:rgba(255,255,255,.07)'], [6.2, 'border-color:rgba(255,255,255,.07)'], [6.6, `border-color:${TEAL}cc;box-shadow:0 0 30px -6px ${TEAL}`], [7.4, `border-color:${TEAL}cc;box-shadow:0 0 30px -6px ${TEAL}`], [7.8, 'border-color:rgba(255,255,255,.07)'], [D, 'border-color:rgba(255,255,255,.07)']]));
  css.push(pulseKf('pd', 0.9, 0.7), pulseKf('pe', 5.8, 0.5));
  scenes.project7 = page('project7', css.join(''), `
    <div class="t cap" style="left:40px;top:132px">Inputs</div>
    <svg class="wires"><path class="wire" d="M304 360 C340 360 350 360 382 360"/><path class="wire" d="M1110 420 C1110 520 1100 560 1060 584"/>
      <path class="pulse" pathLength="100" style="${anim('pd', D, 'linear')}" d="M304 360 C340 360 350 360 382 360"/>
      <path class="pulse" pathLength="100" style="${anim('pe', D, 'linear')}" d="M1110 420 C1110 520 1100 560 1060 584"/></svg>
    <svg class="ringd" viewBox="0 0 196 196"><circle cx="98" cy="98" r="94" fill="none" stroke="${TEAL}66" stroke-width="1.5" stroke-dasharray="3 9"/></svg>
    <div class="core">${L.claude.replace('<svg', '<svg class="logo"')}</div>
    <div class="t" style="left:${core.x - 110}px;top:${core.y + 108}px;width:220px;text-align:center"><div class="h">TestPilot AI</div><div class="m">12 test design techniques</div></div>
    ${body}
    <div class="panel exp" style="${anim('expGlow')}"><span style="position:absolute;left:20px;top:20px;width:32px;height:32px;display:block">${L.jira}</span>
      <div class="t h2" style="left:66px;top:14px">Export to AIO Tests</div><div class="t m" style="left:66px;top:38px">12 test cases · also PDF, CSV</div></div>`);
}

/* 8. E2E testing with Claude agents: Setup, Plan, Generate and Heal agents with human review gates. */
{
  const css = [];
  const nodes = [
    { x: 330, y: 250, label: 'Setup', sub: 'codebase + live site', up: true },
    { x: 500, y: 440, label: 'Plan', sub: 'test scenarios' },
    { x: 670, y: 250, label: 'Generate', sub: 'specs + page objects', up: true },
    { x: 840, y: 440, label: 'Heal', sub: 'fix failing tests' },
  ];
  const gates = [{ x: 415, y: 345, label: 'Review setup', stage: 'Stage 2' }, { x: 585, y: 345, label: 'Review plan', stage: 'Stage 4' }];
  const pathD = 'M230 360 L330 250 L500 440 L670 250 L840 440 L985 368';
  const tNode = [0.7, 2.0, 3.3, 4.2];
  const gateTimes = [1.2, 2.4];
  css.push(`
  .browser{left:30px;top:290px;width:200px;height:150px}
  .agent{position:absolute;width:84px;height:84px;margin:-42px;border-radius:50%;background:#10161d;border:1.5px solid #222b36;display:grid;place-items:center}
  .agent svg{width:36px;height:36px}
  .gate{position:absolute;width:50px;height:50px;margin:-25px;border-radius:14px;background:#0e1217;border:1.5px solid #222b36;display:grid;place-items:center}
  .gate svg{width:28px;height:28px}
  .out{left:985px;top:180px;width:265px;height:370px}
  .file{position:absolute;left:20px;right:20px;height:44px;border-radius:10px;background:#141a22;border:1px solid #1d252f;display:flex;align-items:center;gap:10px;padding:0 12px}
  .prog{fill:none;stroke:${TEAL};stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:100;filter:drop-shadow(0 0 6px ${TEAL});${anim('prog')}}
  `);
  css.push(kf('prog', [[0, 'stroke-dashoffset:0;opacity:1'], [0.25, 'stroke-dashoffset:0;opacity:0'], [0.28, 'stroke-dashoffset:100;opacity:0'], [0.3, 'stroke-dashoffset:100;opacity:1'],
    [0.7, 'stroke-dashoffset:86.4'], [1.2, 'stroke-dashoffset:74.7'], [1.6, 'stroke-dashoffset:74.7'], [2.0, 'stroke-dashoffset:63.1'], [2.4, 'stroke-dashoffset:51.4'],
    [2.8, 'stroke-dashoffset:51.4'], [3.3, 'stroke-dashoffset:39.7'], [4.2, 'stroke-dashoffset:16.4'], [4.8, 'stroke-dashoffset:0;opacity:1'], [D, 'stroke-dashoffset:0;opacity:1']]));
  nodes.forEach((_, i) => css.push(restOn(`a${i}`, tNode[i], 'border-color:#222b36;box-shadow:none', `border-color:${TEAL};box-shadow:0 0 32px -6px ${TEAL}`)));
  gates.forEach((_, i) => {
    const t = gateTimes[i];
    css.push(kf(`g${i}`, [[0, `transform:scale(1);border-color:${TEAL}`], [0.3, 'transform:scale(1);border-color:#222b36'], [t, 'transform:scale(1);border-color:#222b36'], [t + 0.12, `transform:scale(1.35);border-color:${TEAL}`],
      [t + 0.35, `transform:scale(1);border-color:${TEAL}`], [D, `transform:scale(1);border-color:${TEAL}`]]));
  });
  const files = ['login.setup.md', 'login.plan.md', 'pages/login.page.ts', 'tests/login.spec.ts'];
  files.forEach((_, i) => {
    const t = 5.0 + i * 0.3;
    css.push(kf(`f${i}`, [[0, 'transform:translateX(0);opacity:1'], [0.3, 'transform:translateX(0);opacity:0'], [0.35, 'transform:translateX(-20px);opacity:0'], [t, 'transform:translateX(-20px);opacity:0'], [t + 0.3, 'transform:translateX(0);opacity:1'], [D, 'transform:translateX(0);opacity:1']]));
  });
  css.push(restOn('done', 6.4, 'opacity:0', 'opacity:1'));
  scenes.project8 = page('project8', css.join(''), `
    <svg class="wires"><path class="wire" d="${pathD}" stroke-linejoin="round"/><path class="prog" pathLength="100" d="${pathD}"/></svg>
    <div class="panel browser"><div class="dots"><i></i><i></i><i></i></div><div class="url" style="left:60px">saucedemo.com</div>
      <div class="t h2" style="left:16px;top:48px">Swag Labs</div><div class="t m" style="left:16px;top:74px">feature: login</div>
      <div class="bar" style="position:absolute;left:16px;top:108px;width:110px"></div><div class="bar" style="position:absolute;left:16px;top:124px;width:80px;background:#181f27"></div></div>
    ${nodes.map((nd, i) => `<div class="agent" style="left:${nd.x}px;top:${nd.y}px;${anim(`a${i}`)}">${L.claude}</div>
      <div class="t" style="left:${nd.x - 90}px;top:${nd.up ? nd.y - 104 : nd.y + 52}px;width:180px;text-align:center"><div class="cap">${['Stage 1', 'Stage 3', 'Stage 5', 'Agent'][i]}</div><div class="h2">${nd.label}</div><div class="m" style="font-size:13px">${nd.sub}</div></div>`).join('')}
    ${gates.map((g, i) => `<div class="gate" style="left:${g.x}px;top:${g.y}px;${anim(`g${i}`)}">${ICON.person}</div>
      <div class="t" style="left:${g.x - 70}px;top:${g.y + 32}px;width:140px;text-align:center"><div class="cap">${g.stage}</div><div class="m" style="color:${INK};font-size:13px">${g.label}</div></div>`).join('')}
    <div class="panel out"><div class="tile xs" style="left:20px;top:20px">${L.playwright}</div>
      <div class="t h2" style="left:72px;top:18px">Test suite</div><div class="t m" style="left:72px;top:42px">Playwright + POM</div>
      ${files.map((f, i) => `<div class="file" style="top:${90 + i * 54}px;${anim(`f${i}`)}">${check('', `style="border-color:${TEAL};background:${TEAL}22"`)}<span class="m" style="color:${INK};font-size:13px">${f}</span></div>`).join('')}
      <div class="t" style="left:20px;right:20px;bottom:18px;height:40px;border-radius:10px;background:${TEAL}14;border:1px solid ${TEAL}55;display:flex;align-items:center;padding:0 12px;${anim('done')}"><span class="s" style="color:${INK}">18 tests passing</span></div></div>`);
}

/* 9. Propmaster: record what a test step changed in PostgreSQL, then check business rules. */
{
  const css = [];
  const X = `<svg viewBox="0 0 24 24" fill="none" stroke="${RED}" stroke-width="2.4" stroke-linecap="round"><path d="M7 7l10 10M17 7L7 17"/></svg>`;
  css.push(`
  .bar9{position:absolute;left:30px;top:24px;width:1220px;height:62px;border-radius:16px;background:#0e1217;border:1px solid rgba(255,255,255,.07);display:flex;align-items:center;padding:0 18px;gap:26px}
  .logo9{width:36px;height:36px;border-radius:10px;background:${TEAL};color:#07090c;font:600 20px/36px 'Calibre';text-align:center}
  .nav9{display:flex;gap:22px}
  .nav9 span{font-size:16px;color:${SUB}}
  .nav9 span.on{color:${INK}}
  .rec{display:flex;align-items:center;gap:7px;height:30px;padding:0 12px;border-radius:15px;background:${RED}22;color:${RED};font:600 14px/30px 'Calibre'}
  .rec i{width:9px;height:9px;border-radius:50%;background:${RED};display:block;animation:pulse9 1s ease-in-out infinite}
  @keyframes pulse9{0%,100%{opacity:1}50%{opacity:.3}}
  .db9{display:flex;align-items:center;gap:8px;height:34px;padding:0 12px;border-radius:10px;background:#141a22}
  .db9 span.ic{width:20px;height:20px;display:block}.db9 span.ic svg{width:20px;height:20px}
  .steps9{position:absolute;left:30px;top:100px;width:1220px;height:58px;border-radius:14px;background:#0b0f14;border:1px solid rgba(255,255,255,.06);display:flex;align-items:center;padding:0 22px}
  .stg{position:absolute;top:13px;display:flex;align-items:center;gap:10px}
  .dot9{width:30px;height:30px;border-radius:50%;border:2px solid #29323d;display:grid;place-items:center;font:600 13px/1 'Calibre';color:${SUB}}
  .dot9 svg{width:16px;height:16px}
  .done9{background:${TEAL};border-color:${TEAL}}
.done9 svg path,.dot9 .dk svg path{stroke:#07090c}
  .recp{left:30px;top:176px;width:800px;height:510px}
  .btn9{height:34px;padding:0 14px;border-radius:10px;font:600 14px/34px 'Calibre';display:inline-block}
  .inp{position:absolute;left:24px;top:76px;width:590px;height:46px;border-radius:10px;border:1.5px solid #222b36;background:#0b0f14;padding-left:16px;font-size:16px;line-height:43px;color:${SUB}}
  .add9{position:absolute;left:628px;top:76px;width:148px;height:46px;border-radius:10px;background:${TEAL};color:#07090c;font:600 16px/46px 'Calibre';text-align:center}
  .step9{position:absolute;left:24px;top:142px;width:752px;height:292px;border-radius:14px;border:1px solid #1d252f;background:#0b0f14}
  .th,.tr9{position:absolute;left:16px;right:16px;display:grid;grid-template-columns:96px 130px 140px 1fr;align-items:center}
  .th{top:54px;height:30px;border-bottom:1px solid #1d252f}
  .tr9{height:50px;border-bottom:1px solid #151b23}
  .op{display:inline-block;width:72px;height:26px;border-radius:7px;font:600 13px/26px 'SF Mono',monospace;text-align:center}
  .rules{left:850px;top:176px;width:400px;height:510px}
  .rule{position:absolute;left:20px;right:20px;display:flex;gap:12px;align-items:flex-start}
  .rule .txt{font-size:16px;color:${INK};white-space:normal;line-height:1.3;width:230px}
  .rule .res{margin-left:auto;font:400 13px/22px 'SF Mono',monospace;white-space:nowrap}
  .ic9{width:24px;height:24px;border-radius:50%;border:2px solid #29323d;display:grid;place-items:center;flex-shrink:0}
  .ic9 svg{width:14px;height:14px}
  `);
  // Stage bar: Find and Seed are done; Record, then Check, become active in turn.
  const stages = ['Find', 'Seed', 'Record', 'Check', 'Clean'];
  css.push(kf('sRec', [[0, `background:${TEAL};border-color:${TEAL};box-shadow:none`], [0.3, `background:transparent;border-color:${RED};box-shadow:0 0 0 5px ${RED}33`],
    [3.6, `background:transparent;border-color:${RED};box-shadow:0 0 0 5px ${RED}33`], [3.9, `background:${TEAL};border-color:${TEAL};box-shadow:none`], [D, `background:${TEAL};border-color:${TEAL};box-shadow:none`]]));
  css.push(kf('sChk', [[0, `background:${TEAL};border-color:${TEAL};box-shadow:none`], [0.3, 'background:transparent;border-color:#29323d;box-shadow:none'],
    [3.8, 'background:transparent;border-color:#29323d;box-shadow:none'], [4.0, `background:transparent;border-color:${TEAL};box-shadow:0 0 0 5px ${TEAL}33`],
    [5.8, `background:transparent;border-color:${TEAL};box-shadow:0 0 0 5px ${TEAL}33`], [6.1, `background:${TEAL};border-color:${TEAL};box-shadow:none`], [D, `background:${TEAL};border-color:${TEAL};box-shadow:none`]]));
  css.push(restOn('sRecC', 3.9, 'opacity:0', 'opacity:1'), restOn('sChkC', 6.1, 'opacity:0', 'opacity:1'));
  const stageHtml = stages.map((name, i) => {
    const x = 330 + i * 165;
    let dot;
    if (i < 2) dot = `<div class="dot9 done9">${ICON.check}</div>`;
    else if (i === 2) dot = `<div class="dot9" style="${anim('sRec')}"><span class="dk" style="${anim('sRecC')};display:grid">${ICON.check}</span></div>`;
    else if (i === 3) dot = `<div class="dot9" style="${anim('sChk')}"><span class="dk" style="${anim('sChkC')};display:grid">${ICON.check}</span></div>`;
    else dot = '<div class="dot9">5</div>';
    return `<div class="stg" style="left:${x}px">${dot}<span class="s" style="color:${i < 4 ? INK : SUB}">${name}</span></div>`;
  }).join('');
  // Recorded changes for "Click Place Order" appear one by one.
  const rows = [
    ['update', AMBER, 'inventory', 'product_id=3', `stock <span style="color:${SUB};text-decoration:line-through">6</span> → <b style="color:${AMBER}">4</b>`],
    ['insert', BLUE, 'orders', 'id=57', 'status PENDING · total 84.50'],
    ['insert', BLUE, 'order_items', 'id=57', 'qty 2 · unit_price 42.25'],
    ['insert', BLUE, 'payments', 'id=57', 'amount 84.50 · CARD'],
  ];
  let rowHtml = '';
  rows.forEach(([op, color, table, row, change], i) => {
    const t = 0.9 + i * 0.7;
    css.push(restOn(`row${i}`, t, 'opacity:0;transform:translateY(-6px)', 'opacity:1;transform:translateY(0)'));
    css.push(kf(`flash${i}`, [[0, 'background:transparent'], [t, `background:${TEAL}22`], [t + 0.9, 'background:transparent'], [D, 'background:transparent']]));
    rowHtml += `<div class="tr9" style="top:${88 + i * 50}px;animation:row${i} ${D}s cubic-bezier(.45,0,.25,1) 0s infinite, flash${i} ${D}s linear 0s infinite;">
      <span><span class="op" style="color:${color};background:${color}22">${op}</span></span><span class="s" style="color:${INK}">${table}</span><span class="m">${row}</span><span class="s" style="color:${INK}">${change}</span></div>`;
  });
  // Rules are evaluated one by one; the payment rule fails.
  const rules = [
    ['Order total is the items’ price, with 10% off for 2+ items', true, '1 row · pass'],
    ['Payment amount matches the order total', false, '1 violation'],
    ['Every order has exactly one payment', true, '1 row · pass'],
    ['Items are charged at the current price', true, '1 row · pass'],
  ];
  let ruleHtml = '';
  rules.forEach(([text, ok, res], i) => {
    const t = 4.2 + i * 0.35;
    css.push(restOn(`ri${i}`, t, 'border-color:#29323d;background:transparent', ok ? `border-color:${TEAL};background:${TEAL}22` : `border-color:${RED};background:${RED}22`));
    css.push(restOn(`rc${i}`, t + 0.05, 'opacity:0;transform:scale(.4)', 'opacity:1;transform:scale(1)'));
    css.push(restOn(`rr${i}`, t + 0.1, 'opacity:0', 'opacity:1'));
    if (!ok) css.push(kf('shake9', [[0, 'transform:translateX(0)'], [t + 0.1, 'transform:translateX(0)'], [t + 0.18, 'transform:translateX(-5px)'], [t + 0.26, 'transform:translateX(5px)'], [t + 0.34, 'transform:translateX(-3px)'], [t + 0.42, 'transform:translateX(0)'], [D, 'transform:translateX(0)']]));
    ruleHtml += `<div class="rule" style="top:${92 + i * 66}px;${ok ? '' : anim('shake9')}">
      <div class="ic9" style="${anim(`ri${i}`)}"><span style="display:grid;${anim(`rc${i}`)}">${ok ? ICON.check : X}</span></div>
      <span class="txt">${text}</span><span class="res" style="color:${ok ? SUB : RED};${anim(`rr${i}`)}">${res}</span></div>`;
  });
  css.push(restOn('viol', 5.4, 'opacity:0;transform:translateY(6px)', 'opacity:1;transform:translateY(0)'));
  css.push(restOn('sum9', 5.8, 'opacity:0', 'opacity:1'));
  scenes.project9 = page('project9', css.join(''), `
    <div class="bar9"><div class="logo9">P</div><span class="h2">Propmaster</span>
      <div class="nav9"><span>Home</span><span class="on">Record</span><span>Sessions</span><span>Find data</span><span>Seed &amp; clean</span><span>Rules</span></div>
      <div style="margin-left:auto;display:flex;gap:12px;align-items:center"><span class="rec"><i></i>REC</span><span class="db9"><span class="ic">${L.postgresql}</span><span class="m" style="color:${INK}">test db</span></span></div></div>
    <div class="steps9"><span class="cap" style="color:${TEAL}">Test</span><span class="h2" style="margin-left:12px">TC-142 Guest checkout</span>${stageHtml}</div>
    <div class="panel recp">
      <div style="position:absolute;left:24px;top:22px;display:flex;align-items:center;gap:12px"><span class="rec"><i></i>REC</span><span class="h">TC-142 Guest checkout</span><span class="m">#1 · 0:42</span></div>
      <div style="position:absolute;right:24px;top:20px;display:flex;gap:8px"><span class="btn9" style="background:${AMBER}22;color:${AMBER}">Pause</span><span class="btn9" style="background:${AMBER}22;color:${AMBER}">Flag</span><span class="btn9" style="background:${RED}22;color:${RED}">Stop</span></div>
      <div class="inp">What are you about to do? e.g. Click Place Order</div><div class="add9">+ Add step</div>
      <div class="step9">
        <div style="position:absolute;left:16px;top:16px;display:flex;align-items:center;gap:12px"><span class="op" style="width:auto;padding:0 10px;color:${TEAL};background:${TEAL}22">Step 2</span><span class="h2">Click Place Order</span></div>
        <span class="m" style="position:absolute;right:16px;top:20px">4 changes</span>
        <div class="th"><span class="cap">Op</span><span class="cap">Table</span><span class="cap">Row</span><span class="cap">Changes</span></div>
        ${rowHtml}</div>
      <div style="position:absolute;left:24px;bottom:22px;display:flex;align-items:center;gap:10px"><span class="cap">Export</span>
        ${['HTML', 'Markdown', 'SQL checks'].map((x) => `<span class="m" style="color:${INK};background:#141a22;border-radius:8px;padding:4px 10px">${x}</span>`).join('')}</div></div>
    <div class="panel rules"><div class="t h2" style="left:20px;top:20px">Business rules</div><div class="t m" style="left:20px;top:46px">demo/rules.sql · 4 rules</div>
      ${ruleHtml}
      <div class="t" style="left:20px;right:20px;top:362px;height:52px;border-radius:10px;background:${RED}14;border:1px solid ${RED}55;padding:6px 12px;${anim('viol')}">
        <div class="cap" style="color:${RED}">Violation</div><div class="m" style="color:${INK}">order 55 · amount 84.50 · total 76.05</div></div>
      <div class="t" style="left:20px;right:20px;top:428px;height:46px;border-radius:10px;background:#141a22;display:flex;align-items:center;padding:0 14px;${anim('sum9')}">
        <span class="h2" style="font-size:16px">3 passed · 1 failed</span><span class="m" style="margin-left:auto">exit code 1</span></div></div>`);
}

for (const [id, html] of Object.entries(scenes)) {
  fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
  fs.writeFileSync(path.join(__dirname, 'out', `${id}.html`), applyPalette(html, id));
}
console.log('built', Object.keys(scenes).join(', '));
