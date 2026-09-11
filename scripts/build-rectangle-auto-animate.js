#!/usr/bin/env node

/**
 * Build a two-slide, offline Reveal.js deck that demonstrates one rectangle
 * changing size. The only presentation animation is Reveal Auto-Animate.
 */

const fs = require('fs');
const path = require('path');

const skillRoot = path.dirname(__dirname);

function timestamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes())
  ].join('-');
}

const output = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(
      skillRoot,
      'output',
      `reveal-self-contained-rectangle-${timestamp()}.html`
    );

function read(relativePath) {
  return fs.readFileSync(path.join(skillRoot, relativePath), 'utf8');
}

function inlineCss(relativePath) {
  return read(relativePath).replace(/<\/style/gi, '<\\/style');
}

function inlineJs(relativePath) {
  return read(relativePath).replace(/<\/script/gi, '<\\/script');
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>矩形尺寸变化｜Auto-Animate</title>

  <style id="reveal-reset">
${inlineCss('assets/reveal/reset.css')}
  </style>
  <style id="reveal-core-css">
${inlineCss('assets/reveal/reveal.css')}
  </style>
  <style id="theme-slot">
${inlineCss('assets/reveal/theme/white.css')}
  </style>
  <style id="custom-css">
    :root {
      --canvas: #f3f0e8;
      --rectangle: #171918;
    }

    html,
    body,
    .reveal {
      width: 100%;
      height: 100%;
      margin: 0;
      background: var(--canvas);
    }

    .reveal .slides section.rectangle-slide {
      display: grid !important;
      place-items: center;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      padding: 0;
      background: var(--canvas);
    }

    .rectangle {
      box-sizing: border-box;
      flex: none;
      border-radius: 18px;
      background: var(--rectangle);
    }
  </style>
</head>
<body>
  <div class="reveal">
    <div class="slides">
      <section
        class="rectangle-slide"
        data-auto-animate
        data-auto-animate-duration="1.4"
      >
        <div
          class="rectangle"
          data-id="rectangle"
          style="width: 260px; height: 160px;"
          aria-label="小矩形"
        ></div>
      </section>

      <section
        class="rectangle-slide"
        data-auto-animate
        data-auto-animate-duration="1.4"
      >
        <div
          class="rectangle"
          data-id="rectangle"
          style="width: 860px; height: 480px;"
          aria-label="大矩形"
        ></div>
      </section>
    </div>
  </div>

  <script>
${inlineJs('assets/reveal/reveal.js')}
  </script>
  <script>
${inlineJs('assets/reveal/plugin/markdown.js')}
  </script>
  <script>
${inlineJs('assets/reveal/plugin/highlight.js')}
  </script>
  <script>
${inlineJs('assets/minimap.js')}
  </script>
  <script>
    (function () {
      'use strict';

      var ready = Reveal.initialize({
        width: 1600,
        height: 900,
        margin: 0.06,
        minScale: 0.2,
        maxScale: 2.0,
        hash: true,
        transition: 'none',
        backgroundTransition: 'none',
        controls: true,
        controlsLayout: 'bottom-right',
        controlsBackArrows: 'visible',
        progress: true,
        slideNumber: false,
        keyboard: true,
        touch: true,
        overview: true,
        fragments: false,
        help: true,
        pause: true,
        plugins: [RevealMarkdown, RevealHighlight]
      });

      if (ready && typeof ready.then === 'function') {
        ready.then(function () {
          document.documentElement.dataset.deckReady = 'true';
        });
      }
    }());
  </script>
</body>
</html>
`;

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, html, 'utf8');
console.log(`Wrote ${output}`);
console.log(`Embedded bytes: ${Buffer.byteLength(html, 'utf8')}`);
