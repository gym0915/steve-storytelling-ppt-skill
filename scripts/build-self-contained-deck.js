#!/usr/bin/env node

/**
 * Build the single-file Reveal.js deck.
 *
 * Reveal.js runtime files and the custom minimap are bundled in ../assets.
 * The builder never reads the project's external dist/ or minimap directories.
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
      `reveal-self-contained-${timestamp()}.html`
    );

function read(relativePath) {
  return fs.readFileSync(path.join(skillRoot, relativePath), 'utf8');
}

function inlineCss(relativePath) {
  return read(relativePath).replace(/<\/style/gi, '<\\/style');
}

function inlineJs(relativePath) {
  // Prevent a literal closing script tag inside a vendored bundle from
  // terminating the host script element while the browser parses the file.
  return read(relativePath).replace(/<\/script/gi, '<\\/script');
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>AI时代的组织变革｜公司还会长成现在这样吗？</title>

  <!-- === REVEAL RESET: inlined from dist/reset.css === -->
  <style id="reveal-reset">
${inlineCss('assets/reveal/reset.css')}
  </style>

  <!-- === REVEAL CORE CSS: inlined from dist/reveal.css === -->
  <style id="reveal-core-css">
${inlineCss('assets/reveal/reveal.css')}
  </style>

  <!-- === REVEAL THEME: inlined from dist/theme/white.css === -->
  <style id="theme-slot">
${inlineCss('assets/reveal/theme/white.css')}
  </style>

  <!-- === CUSTOM ASSEMBLY STYLES ===
       These rules preserve the current layout while white.css supplies the
       base Reveal theme. The visual system can be refined here later. -->
  <style id="custom-css">
    :root {
      --r-background: #fff;
      --r-background-color: #fff;
      --r-main-font-size: clamp(1rem, 1.9vw, 2rem);
      --r-main-color: #222;
      --r-block-margin: clamp(0.5rem, 1.25vw, 1.25rem);
      --r-heading-margin: 0 0 clamp(0.75rem, 1.8vw, 1.5rem) 0;
      --r-heading-line-height: 1.12;
      --r-heading-letter-spacing: -0.025em;
      --r-heading-text-transform: none;
      --r-heading-font-weight: 700;
      --r-heading1-text-shadow: none;
      --r-heading1-size: clamp(2rem, 6vw, 5.8rem);
      --r-heading2-size: clamp(1.65rem, 4vw, 3.7rem);
      --r-heading3-size: clamp(1.2rem, 2.6vw, 2.25rem);
      --r-heading4-size: clamp(1rem, 2vw, 1.7rem);
      --r-code-font: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      --r-link-color: #2a76dd;
      --r-link-color-dark: #1f64c1;
      --r-link-color-hover: #4a8be2;
      --r-selection-background-color: rgba(42, 118, 221, 0.18);
      --r-selection-color: #222;
    }

    html, body {
      width: 100%;
      height: 100%;
      background: var(--r-background-color);
    }

    body {
      overflow: hidden;
      color: var(--r-main-color);
      font-family: var(--r-main-font);
    }

    .reveal {
      background:
        radial-gradient(circle at 12% 18%, rgba(42, 118, 221, 0.05), transparent 26%),
        var(--r-background-color);
    }

    .reveal .slides section.slide {
      height: 100%;
      max-height: 100%;
      overflow: hidden;
      box-sizing: border-box;
      padding: clamp(1.75rem, 5vw, 5.5rem) clamp(1.75rem, 7vw, 8rem);
      text-align: left;
    }

    .reveal .slides section.slide.title-slide {
      display: flex !important;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding-right: clamp(3rem, 14vw, 15rem);
    }

    .reveal h1, .reveal h2, .reveal h3, .reveal h4,
    .reveal p, .reveal ul, .reveal ol, .reveal pre {
      margin-top: 0;
    }

    .reveal h1, .reveal h2, .reveal h3, .reveal h4 {
      max-width: 15ch;
    }

    .reveal p {
      max-width: 58ch;
      line-height: 1.45;
    }

    .eyebrow, .section-kicker, .status-chip, .card-index {
      color: #2a76dd;
      font-size: clamp(0.62rem, 0.9vw, 0.85rem);
      font-weight: 700;
      letter-spacing: 0.13em;
      text-transform: uppercase;
    }

    .eyebrow { margin-bottom: clamp(1rem, 2vw, 1.75rem); }

    .title-slide h1 {
      max-width: 10ch;
      margin-bottom: clamp(1rem, 2.5vw, 2rem);
    }

    .title-slide h1 span { color: #2a76dd; }

    .lead {
      max-width: 34ch !important;
      color: rgba(34, 34, 34, 0.72);
      font-size: clamp(1rem, 2vw, 1.65rem);
    }

    .title-meta {
      display: flex;
      flex-wrap: wrap;
      gap: clamp(0.5rem, 1.2vw, 1rem);
      margin-top: clamp(1.5rem, 4vw, 3rem);
      color: rgba(34, 34, 34, 0.48);
      font-size: clamp(0.7rem, 1vw, 0.9rem);
    }

    .title-meta span {
      border: 1px solid rgba(34, 34, 34, 0.18);
      border-radius: 999px;
      padding: clamp(0.35rem, 0.7vw, 0.55rem) clamp(0.65rem, 1.2vw, 1rem);
    }

    .section-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: clamp(1rem, 3vw, 3rem);
      margin-bottom: clamp(1.25rem, 3vw, 2.75rem);
    }

    .section-head h2 { margin-bottom: 0; }

    .section-summary {
      max-width: 30ch !important;
      margin: 0;
      color: rgba(34, 34, 34, 0.56);
      font-size: clamp(0.78rem, 1.2vw, 1.05rem);
      text-align: right;
    }

    .assembly-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: clamp(0.65rem, 1.5vw, 1.25rem);
      max-height: 58vh;
    }

    .assembly-card {
      min-height: 0;
      padding: clamp(0.9rem, 1.8vw, 1.6rem);
      border: 1px solid rgba(34, 34, 34, 0.16);
      border-radius: clamp(0.5rem, 1vw, 0.9rem);
      background: rgba(34, 34, 34, 0.035);
    }

    .assembly-card h3 {
      margin: clamp(0.55rem, 1vw, 0.9rem) 0 clamp(0.45rem, 0.8vw, 0.75rem);
      font-size: clamp(1rem, 1.8vw, 1.45rem);
    }

    .assembly-card p {
      margin-bottom: 0;
      color: rgba(34, 34, 34, 0.56);
      font-size: clamp(0.72rem, 1.05vw, 0.95rem);
    }

    .pipeline {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: clamp(0.6rem, 1.3vw, 1rem);
      max-height: 55vh;
      align-items: stretch;
    }

    .pipeline-step {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: clamp(9rem, 22vh, 13rem);
      padding: clamp(0.9rem, 1.7vw, 1.5rem);
      border-left: 2px solid #2a76dd;
      background: linear-gradient(135deg, rgba(42, 118, 221, 0.08), rgba(34, 34, 34, 0.025));
    }

    .pipeline-step strong {
      display: block;
      margin-top: clamp(0.5rem, 1vw, 0.9rem);
      font-size: clamp(0.95rem, 1.7vw, 1.35rem);
    }

    .pipeline-step span:last-child {
      color: rgba(34, 34, 34, 0.54);
      font-size: clamp(0.68rem, 1vw, 0.88rem);
      line-height: 1.4;
    }

    .code-layout {
      display: grid;
      grid-template-columns: minmax(0, 1.12fr) minmax(12rem, 0.88fr);
      gap: clamp(1rem, 3vw, 3rem);
      align-items: center;
      max-height: 61vh;
    }

    .code-window {
      min-width: 0;
      padding: clamp(0.75rem, 1.4vw, 1.25rem);
      border: 1px solid rgba(34, 34, 34, 0.17);
      border-radius: clamp(0.5rem, 1vw, 0.9rem);
      background: #0b0d0e;
    }

    .code-window pre {
      width: 100%;
      max-height: 44vh;
      margin: 0;
      box-shadow: none;
    }

    .code-window code {
      max-height: 44vh;
      padding: 0;
      color: #dce7ec;
      font-family: var(--r-code-font);
      font-size: clamp(0.62rem, 1.05vw, 0.92rem);
      line-height: 1.5;
      overflow: hidden;
    }

    .code-note {
      display: flex;
      flex-direction: column;
      gap: clamp(0.6rem, 1.3vw, 1rem);
    }

    .code-note p {
      margin: 0;
      color: rgba(34, 34, 34, 0.58);
      font-size: clamp(0.78rem, 1.15vw, 1rem);
    }

    .code-note strong { color: #222; }

    .minimap-layout {
      display: grid;
      grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
      gap: clamp(1rem, 4vw, 4rem);
      align-items: center;
      max-height: 62vh;
    }

    .minimap-visual {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: clamp(14rem, 38vh, 23rem);
      border: 1px solid rgba(34, 34, 34, 0.13);
      border-radius: clamp(0.6rem, 1.2vw, 1rem);
      background: radial-gradient(circle, rgba(42, 118, 221, 0.08), transparent 56%);
    }

    .minimap-demo-lines {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: clamp(0.45rem, 1vw, 0.8rem);
      padding: clamp(1rem, 2vw, 1.7rem);
      border-right: 2px solid rgba(34, 34, 34, 0.18);
    }

    .minimap-demo-lines i {
      display: block;
      width: clamp(1rem, 2.4vw, 2.6rem);
      height: clamp(0.15rem, 0.25vw, 0.25rem);
      border-radius: 999px;
      background: rgba(34, 34, 34, 0.3);
    }

    .minimap-demo-lines i:nth-child(4) {
      width: clamp(2rem, 5vw, 5rem);
      background: #2a76dd;
      box-shadow: 0 0 1.2rem rgba(42, 118, 221, 0.24);
    }

    .minimap-points {
      display: grid;
      gap: clamp(0.75rem, 1.6vw, 1.25rem);
    }

    .minimap-point {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: clamp(0.6rem, 1.2vw, 1rem);
      align-items: start;
    }

    .minimap-point b {
      display: grid;
      place-items: center;
      width: clamp(1.35rem, 2.5vw, 2rem);
      height: clamp(1.35rem, 2.5vw, 2rem);
      border: 1px solid rgba(42, 118, 221, 0.5);
      border-radius: 50%;
      color: #2a76dd;
      font-size: clamp(0.65rem, 1vw, 0.8rem);
    }

    .minimap-point p {
      margin: 0;
      color: rgba(34, 34, 34, 0.62);
      font-size: clamp(0.78rem, 1.15vw, 1rem);
    }

    .fragment-demo {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: clamp(0.7rem, 1.7vw, 1.5rem);
      max-height: 46vh;
    }

    .fragment-card {
      min-height: clamp(9rem, 22vh, 14rem);
      padding: clamp(1rem, 2vw, 1.7rem);
      border: 1px solid rgba(34, 34, 34, 0.15);
      border-radius: clamp(0.5rem, 1vw, 0.85rem);
      background: rgba(34, 34, 34, 0.03);
    }

    .fragment-card h3 {
      margin-bottom: clamp(0.55rem, 1vw, 0.8rem);
      font-size: clamp(1rem, 1.8vw, 1.35rem);
    }

    .fragment-card p {
      margin: 0;
      color: rgba(34, 34, 34, 0.58);
      font-size: clamp(0.74rem, 1.05vw, 0.92rem);
    }

    .markdown-preview {
      max-width: 50rem;
      margin: 0 auto;
      padding: clamp(1.25rem, 3vw, 2.5rem);
      border: 1px solid rgba(34, 34, 34, 0.15);
      border-radius: clamp(0.6rem, 1.2vw, 1rem);
      background: rgba(34, 34, 34, 0.035);
    }

    .markdown-preview h2 { margin-bottom: clamp(0.8rem, 1.7vw, 1.4rem); }
    .markdown-preview ul { margin: 0; padding-left: 1.2em; }
    .markdown-preview li { margin-bottom: clamp(0.45rem, 1vw, 0.8rem); }

    .closing-slide {
      display: flex !important;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center !important;
    }

    .closing-slide h2 { max-width: 18ch; }
    .closing-slide p { color: rgba(34, 34, 34, 0.56); }

    .reveal .progress { height: 0.2rem; color: #2a76dd; }
    .reveal .slide-number {
      right: clamp(0.75rem, 2vw, 2rem);
      bottom: clamp(0.65rem, 1.6vw, 1.35rem);
      padding: 0.35em 0.55em;
      color: rgba(34, 34, 34, 0.6);
      background: rgba(255, 255, 255, 0.86);
      font-size: clamp(0.55rem, 0.8vw, 0.7rem);
    }

    .hljs-comment { color: #6f858e; }
    .hljs-keyword, .hljs-selector-tag, .hljs-title, .hljs-name { color: #2a76dd; }
    .hljs-string, .hljs-attribute, .hljs-literal { color: #c9f2c1; }
    .hljs-number, .hljs-built_in { color: #f5d58c; }

    .reveal .slides section.story-slide {
      display: flex !important;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      margin: 0;
    }

    .reveal .slides section.story-slide--center {
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .reveal .slides section.story-slide--corner {
      align-items: flex-start;
      justify-content: flex-start;
      text-align: left;
    }

    .reveal .story-word {
      margin: 0;
      color: #222;
      font-family: var(--r-heading-font);
      font-size: 100px;
      font-weight: 700;
      line-height: 1;
      letter-spacing: -0.04em;
    }

    .reveal .story-slide--corner .story-word {
      font-size: 32px;
    }

    .reveal .shape-stage {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 520px;
    }

    .reveal .story-square,
    .reveal .story-copy {
      position: absolute;
      box-sizing: border-box;
    }

    .reveal .story-square {
      width: 140px;
      height: 140px;
      border-radius: 10px;
    }

    .reveal .story-square--one {
      left: 11%;
      top: 25%;
      background: #ff6b6b;
    }

    .reveal .story-square--two {
      left: 42%;
      top: 16%;
      width: 180px;
      height: 180px;
      background: #4dabf7;
    }

    .reveal .story-square--three {
      left: 73%;
      top: 48%;
      width: 110px;
      height: 110px;
      background: #ffd43b;
    }

    .reveal .story-copy {
      color: #222;
      font-size: 30px;
      font-weight: 700;
      letter-spacing: 0.08em;
      line-height: 1.1;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .reveal .story-copy--one {
      left: 12%;
      top: 66%;
    }

    .reveal .story-copy--two {
      left: 47%;
      top: 65%;
      font-size: 38px;
    }

    .reveal .story-copy--three {
      left: 70%;
      top: 20%;
      color: #868e96;
      font-size: 24px;
    }

    .reveal .story-slide--scene-two .story-square--one {
      left: 58%;
      top: 11%;
      width: 210px;
      height: 210px;
      border-radius: 18px;
      background: #ff8787;
    }

    .reveal .story-slide--scene-two .story-square--two {
      left: 19%;
      top: 52%;
      width: 120px;
      height: 120px;
      border-radius: 4px;
      background: #339af0;
    }

    .reveal .story-slide--scene-two .story-square--three {
      left: 76%;
      top: 62%;
      width: 170px;
      height: 170px;
      border-radius: 22px;
      background: #fcc419;
    }

    .reveal .story-slide--scene-two .story-copy--one {
      left: 60%;
      top: 43%;
      font-size: 42px;
    }

    .reveal .story-slide--scene-two .story-copy--two {
      left: 21%;
      top: 25%;
      font-size: 26px;
    }

    .reveal .story-slide--scene-two .story-copy--three {
      left: 73%;
      top: 84%;
      color: #868e96;
      font-size: 22px;
    }

    @media (max-height: 700px) {
      .reveal .slides section.slide { padding-top: clamp(1.1rem, 3vw, 2rem); padding-bottom: clamp(1.1rem, 3vw, 2rem); }
      .section-head { margin-bottom: clamp(0.7rem, 1.5vw, 1.25rem); }
      .assembly-grid, .pipeline, .code-layout, .minimap-layout { max-height: 67vh; }
    }

    @media (max-height: 600px) {
      .reveal .slides section.slide { padding-left: clamp(1rem, 4vw, 3rem); padding-right: clamp(1rem, 4vw, 3rem); }
      .title-slide h1 { margin-bottom: 0.6rem; }
      .title-meta { margin-top: 1rem; }
      .assembly-card { padding: 0.7rem; }
      .pipeline-step { min-height: 7rem; padding: 0.7rem; }
    }

    @media (max-height: 500px) {
      .reveal .slides section.slide { padding-top: 0.8rem; padding-bottom: 0.8rem; }
      .eyebrow { margin-bottom: 0.55rem; }
      .section-summary { display: none; }
      .code-layout, .minimap-layout { gap: 1rem; }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: 0.01ms !important;
      }
    }

    /* === STORY DECK SYSTEM: AI × ORGANIZATION === */
    :root {
      --ink: #171918;
      --paper: #f1eee6;
      --muted: #a4a69e;
      --acid: #c8f169;
      --coral: #ff715b;
      --sky: #94d9ff;
      --line: rgba(241, 238, 230, 0.18);
      --soft-line: rgba(23, 25, 24, 0.16);
    }

    .reveal .slides section.story-slide {
      padding: clamp(2rem, 5vw, 5.75rem) clamp(2rem, 7vw, 8.5rem);
      overflow: hidden;
    }

    .reveal .slides section.deck-dark {
      color: var(--paper);
      background: var(--ink);
    }

    .reveal .slides section.deck-paper {
      color: var(--ink);
      background: var(--paper);
    }

    .reveal .slides section.deck-warm {
      color: var(--ink);
      background: #e5ded1;
    }

    .reveal .slides section.deck-dark h1,
    .reveal .slides section.deck-dark h2,
    .reveal .slides section.deck-dark h3,
    .reveal .slides section.deck-dark p,
    .reveal .slides section.deck-dark li { color: inherit; }

    .reveal .story-shell {
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .reveal .story-topline {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      color: var(--muted);
      font-size: clamp(0.62rem, 0.85vw, 0.8rem);
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    .reveal .deck-paper .story-topline,
    .reveal .deck-warm .story-topline { color: rgba(23, 25, 24, 0.48); }
    .reveal .story-topline .accent { color: var(--acid); }
    .reveal .deck-paper .story-topline .accent,
    .reveal .deck-warm .story-topline .accent { color: #6d8f16; }

    .reveal .story-title {
      max-width: 11ch;
      margin: 0;
      color: var(--paper);
      font-size: clamp(3.1rem, 8vw, 8.6rem);
      line-height: 0.96;
      letter-spacing: -0.065em;
    }

    .reveal .story-title em {
      color: var(--acid);
      font-style: normal;
    }

    .reveal .deck-paper .story-title,
    .reveal .deck-warm .story-title { color: var(--ink); }
    .reveal .deck-paper .story-title em,
    .reveal .deck-warm .story-title em { color: #6d8f16; }

    .reveal .story-subtitle {
      max-width: 36ch;
      margin: 0;
      color: rgba(241, 238, 230, 0.62);
      font-size: clamp(1rem, 1.7vw, 1.45rem);
      line-height: 1.45;
    }

    .reveal .deck-paper .story-subtitle,
    .reveal .deck-warm .story-subtitle { color: rgba(23, 25, 24, 0.58); }

    .reveal .story-foot {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 2rem;
      color: rgba(241, 238, 230, 0.42);
      font-size: clamp(0.68rem, 0.95vw, 0.86rem);
    }

    .reveal .deck-paper .story-foot,
    .reveal .deck-warm .story-foot { color: rgba(23, 25, 24, 0.46); }

    .reveal .story-foot strong { color: var(--coral); font-weight: 700; }
    .reveal .story-foot span:last-child { text-align: right; }

    .reveal .big-number {
      margin: 0;
      color: var(--acid);
      font-size: clamp(8rem, 24vw, 22rem);
      font-weight: 800;
      line-height: 0.72;
      letter-spacing: -0.1em;
    }

    .reveal .big-number small {
      display: inline-block;
      margin-left: 0.14em;
      color: var(--paper);
      font-size: 0.28em;
      letter-spacing: -0.04em;
    }

    .reveal .paper-number { color: #769c18; }
    .reveal .paper-number small { color: var(--ink); }

    .reveal .rule {
      width: min(28rem, 55vw);
      height: 1px;
      margin: 1.4rem 0;
      background: var(--line);
    }

    .reveal .deck-paper .rule,
    .reveal .deck-warm .rule { background: var(--soft-line); }

    .reveal .quote {
      max-width: 17ch;
      margin: 0;
      font-size: clamp(2.2rem, 5vw, 5.4rem);
      font-weight: 700;
      line-height: 1.03;
      letter-spacing: -0.055em;
    }

    .reveal .quote .accent { color: var(--coral); }

    .reveal .scene-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: clamp(1.5rem, 5vw, 6rem);
      align-items: center;
      height: 100%;
    }

    .reveal .scene-grid--wide { grid-template-columns: 0.8fr 1.2fr; }

    .reveal .scene-label {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: clamp(1rem, 2vw, 2rem);
      color: var(--coral);
      font-size: clamp(0.68rem, 1vw, 0.86rem);
      font-weight: 800;
      letter-spacing: 0.13em;
      text-transform: uppercase;
    }

    .reveal .scene-label::before {
      content: '';
      display: block;
      width: 1.8rem;
      height: 2px;
      background: currentColor;
    }

    .reveal .scene-heading {
      max-width: 13ch;
      margin: 0 0 1.1rem;
      font-size: clamp(2.2rem, 5vw, 5rem);
      line-height: 1;
      letter-spacing: -0.06em;
    }

    .reveal .scene-copy {
      max-width: 38ch;
      margin: 0;
      color: rgba(241, 238, 230, 0.62);
      font-size: clamp(0.95rem, 1.35vw, 1.2rem);
      line-height: 1.5;
    }

    .reveal .deck-paper .scene-copy,
    .reveal .deck-warm .scene-copy { color: rgba(23, 25, 24, 0.58); }

    .reveal .timeline {
      position: relative;
      display: grid;
      gap: 0.7rem;
      padding: 1.3rem 0 1.3rem 2rem;
    }

    .reveal .timeline::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0.35rem;
      width: 1px;
      background: var(--line);
    }

    .reveal .deck-paper .timeline::before { background: var(--soft-line); }
    .reveal .timeline-item { position: relative; padding: 0.9rem 1rem; border: 1px solid var(--line); border-radius: 0.35rem; }
    .reveal .deck-paper .timeline-item { border-color: var(--soft-line); }
    .reveal .timeline-item::before { content: ''; position: absolute; top: 1.2rem; left: -1.86rem; width: 0.72rem; height: 0.72rem; border-radius: 50%; background: var(--acid); }
    .reveal .timeline-item strong { display: block; font-size: clamp(0.95rem, 1.5vw, 1.25rem); }
    .reveal .timeline-item span { display: block; margin-top: 0.25rem; color: var(--muted); font-size: clamp(0.7rem, 1vw, 0.88rem); }

    .reveal .sinks {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.8rem;
    }

    .reveal .sink {
      min-height: 7rem;
      padding: 1rem;
      border: 1px solid var(--soft-line);
      background: rgba(23, 25, 24, 0.035);
    }

    .reveal .sink strong { display: block; margin-bottom: 0.55rem; color: var(--coral); font-size: clamp(1.1rem, 1.8vw, 1.55rem); }
    .reveal .sink span { color: rgba(23, 25, 24, 0.56); font-size: clamp(0.72rem, 1vw, 0.9rem); }

    .reveal .unit-stage,
    .reveal .highway-stage,
    .reveal .network-stage {
      position: relative;
      min-height: clamp(18rem, 52vh, 30rem);
      overflow: hidden;
      border: 1px solid var(--soft-line);
      background: rgba(23, 25, 24, 0.035);
    }

    .reveal .deck-dark .unit-stage,
    .reveal .deck-dark .highway-stage,
    .reveal .deck-dark .network-stage { border-color: var(--line); background: rgba(241, 238, 230, 0.035); }

    .reveal .unit-node {
      position: absolute;
      display: grid;
      place-items: center;
      box-sizing: border-box;
      width: 7.2rem;
      height: 7.2rem;
      border-radius: 50%;
      color: var(--ink);
      background: var(--acid);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .reveal .unit-node.person { left: 18%; top: 34%; }
    .reveal .unit-node.ai { left: 58%; top: 24%; width: 5.8rem; height: 5.8rem; background: var(--sky); }
    .reveal .unit-node.knowledge { left: 58%; top: 60%; width: 4.8rem; height: 4.8rem; background: var(--coral); }
    .reveal .unit-line { position: absolute; height: 1px; background: var(--soft-line); transform-origin: left center; }
    .reveal .unit-line.one { left: 35%; top: 47%; width: 25%; transform: rotate(-18deg); }
    .reveal .unit-line.two { left: 35%; top: 50%; width: 25%; transform: rotate(19deg); }
    .reveal .unit-caption { position: absolute; left: 7%; bottom: 9%; color: rgba(23, 25, 24, 0.5); font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; }

    .reveal .highway-stage { background: linear-gradient(180deg, rgba(23,25,24,0.02), rgba(23,25,24,0.08)); }
    .reveal .lane { position: absolute; left: 7%; right: 7%; height: 1px; background: var(--soft-line); }
    .reveal .lane.l1 { top: 28%; } .reveal .lane.l2 { top: 50%; } .reveal .lane.l3 { top: 72%; }
    .reveal .car { position: absolute; display: grid; place-items: center; width: 3.6rem; height: 1.8rem; border-radius: 0.25rem; color: var(--ink); background: var(--acid); font-size: 0.55rem; font-weight: 800; }
    .reveal .car.c1 { left: 16%; top: calc(28% - 0.9rem); } .reveal .car.c2 { left: 34%; top: calc(50% - 0.9rem); } .reveal .car.c3 { left: 49%; top: calc(72% - 0.9rem); }
    .reveal .toll { position: absolute; right: 11%; top: 17%; bottom: 17%; width: 2.4rem; border-left: 0.5rem solid var(--coral); border-right: 0.5rem solid var(--coral); }
    .reveal .toll-label { position: absolute; right: 4%; top: 8%; color: var(--coral); font-size: 0.68rem; font-weight: 800; letter-spacing: 0.1em; writing-mode: vertical-rl; text-transform: uppercase; }

    .reveal .output-field { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.55rem; }
    .reveal .output-chip { display: grid; place-items: center; min-height: 4.5rem; border: 1px solid var(--soft-line); background: rgba(23, 25, 24, 0.04); color: rgba(23, 25, 24, 0.62); font-size: 0.7rem; text-align: center; }
    .reveal .output-chip:nth-child(3n) { border-color: rgba(255, 113, 91, 0.55); }
    .reveal .decision-funnel { position: relative; margin: 1.6rem auto 0; width: min(29rem, 86%); height: 13rem; }
    .reveal .decision-funnel::before { content: ''; position: absolute; inset: 0 14% 0 14%; background: linear-gradient(180deg, rgba(255,113,91,0.12), rgba(200,241,105,0.22)); clip-path: polygon(0 0, 100% 0, 63% 100%, 37% 100%); }
    .reveal .decision-funnel span { position: absolute; right: 0; color: var(--coral); font-size: 0.72rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
    .reveal .decision-funnel span:nth-child(1) { top: 0; } .reveal .decision-funnel span:nth-child(2) { bottom: 0; color: #6d8f16; }

    .reveal .manager-split { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .reveal .manager-card { padding: 1.2rem; border: 1px solid var(--soft-line); }
    .reveal .manager-card.old { opacity: 0.56; }
    .reveal .manager-card.new { border-color: #769c18; background: rgba(200,241,105,0.18); }
    .reveal .manager-card h3 { margin: 0 0 1rem; font-size: clamp(1.1rem, 1.8vw, 1.55rem); }
    .reveal .manager-card p { margin: 0; color: rgba(23, 25, 24, 0.62); font-size: clamp(0.78rem, 1.1vw, 0.98rem); line-height: 1.5; }

    .reveal .pyramid { display: flex; flex-direction: column; align-items: center; gap: 0.45rem; }
    .reveal .pyramid-row { display: grid; place-items: center; box-sizing: border-box; height: 2.6rem; border: 1px solid var(--soft-line); color: rgba(23,25,24,0.58); font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; }
    .reveal .pyramid-row.r1 { width: 22%; background: rgba(255,113,91,0.18); } .reveal .pyramid-row.r2 { width: 42%; } .reveal .pyramid-row.r3 { width: 64%; } .reveal .pyramid-row.r4 { width: 86%; }
    .reveal .direct-query { margin-top: 1.3rem; padding: 0.9rem 1rem; border-left: 3px solid #769c18; color: rgba(23,25,24,0.7); font-size: clamp(0.85rem, 1.2vw, 1.05rem); }

    .reveal .network-stage .net-line { position: absolute; height: 1px; background: var(--soft-line); transform-origin: left center; }
    .reveal .network-stage .net-node { position: absolute; display: grid; place-items: center; width: 4.7rem; height: 4.7rem; border-radius: 50%; color: var(--ink); background: var(--acid); font-size: 0.62rem; font-weight: 800; text-align: center; text-transform: uppercase; }
    .reveal .network-stage .n1 { left: 16%; top: 25%; } .reveal .network-stage .n2 { left: 42%; top: 13%; background: var(--sky); } .reveal .network-stage .n3 { left: 68%; top: 31%; background: var(--coral); } .reveal .network-stage .n4 { left: 39%; top: 64%; background: #f2c14e; }
    .reveal .network-stage .l1 { left: 25%; top: 34%; width: 21%; transform: rotate(-21deg); } .reveal .network-stage .l2 { left: 51%; top: 28%; width: 20%; transform: rotate(22deg); } .reveal .network-stage .l3 { left: 46%; top: 35%; width: 31%; transform: rotate(94deg); } .reveal .network-stage .l4 { left: 44%; top: 72%; width: 26%; transform: rotate(-126deg); }

    .reveal .governance-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.55rem; }
    .reveal .governance-grid div { min-height: 6.8rem; padding: 0.8rem; border-top: 2px solid var(--coral); color: rgba(23,25,24,0.65); font-size: clamp(0.7rem, 1vw, 0.86rem); line-height: 1.35; }
    .reveal .governance-grid b { display: block; margin-bottom: 0.55rem; color: var(--ink); font-size: clamp(0.82rem, 1.2vw, 1rem); }

    .reveal .sequence { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.35rem; align-items: stretch; }
    .reveal .sequence-step { position: relative; min-height: 11rem; padding: 1rem 0.85rem; border-top: 2px solid var(--acid); background: rgba(241,238,230,0.06); }
    .reveal .sequence-step:not(:last-child)::after { content: '→'; position: absolute; right: -0.55rem; top: 1.15rem; color: var(--coral); font-size: 1.1rem; z-index: 2; }
    .reveal .sequence-step strong { display: block; margin-bottom: 0.8rem; font-size: 0.95rem; }
    .reveal .sequence-step span { color: var(--muted); font-size: 0.72rem; line-height: 1.35; }

    .reveal .question-mark { margin: 0; color: var(--acid); font-size: clamp(10rem, 28vw, 25rem); font-weight: 800; line-height: 0.6; letter-spacing: -0.14em; }

    @media (max-width: 900px) {
      .reveal .scene-grid, .reveal .scene-grid--wide { grid-template-columns: 1fr; gap: 1rem; }
      .reveal .scene-grid .unit-stage, .reveal .scene-grid .highway-stage, .reveal .scene-grid .network-stage { min-height: 16rem; }
      .reveal .governance-grid { grid-template-columns: repeat(3, 1fr); }
      .reveal .sequence { grid-template-columns: 1fr; }
      .reveal .sequence-step { min-height: 0; }
      .reveal .sequence-step:not(:last-child)::after { content: '↓'; right: 0.8rem; top: auto; bottom: -0.85rem; }
    }
  </style>
</head>
<body>
  <!-- === SLIDE CONTENT === -->
  <div class="reveal">
    <div class="slides">
      <section class="slide story-slide deck-dark" data-state="title">
        <div class="story-shell">
          <div class="story-topline"><span><span class="accent">AI × ORGANIZATION</span> / 2026</span><span>A · 开场</span></div>
          <div>
            <h1 class="story-title">公司还会长成<em>现在</em>这样吗？</h1>
            <div class="rule"></div>
            <p class="story-subtitle">从一个人变快，讲到一家公司必须重新设计自己的工作方式。</p>
          </div>
          <div class="story-foot"><span><strong>组织变革</strong> · 一场关于边界、判断与责任的演讲</span><span>Steve</span></div>
        </div>
      </section>

      <section class="slide story-slide deck-dark story-slide--center">
        <div class="story-shell" style="justify-content:center;align-items:center;text-align:center">
          <div class="story-topline" style="width:100%;position:absolute;top:0"><span>01 / 一个很小的场景</span><span>B · 呼吸</span></div>
          <p class="quote">先别看组织架构图。<br><span class="accent">先看一个人。</span></p>
        </div>
      </section>

      <section class="slide story-slide deck-paper" data-auto-animate>
        <div class="story-shell">
          <div class="story-topline"><span>01 / 一个很小的场景</span><span>A · 听故事</span></div>
          <div class="scene-grid">
            <div>
              <div class="scene-label">两年前 · 产品经理</div>
              <h2 class="scene-heading">竞品分析，快的话一天。</h2>
              <p class="scene-copy">找资料、复制、分类、比较、判断，最后再写成文档和PPT。</p>
            </div>
            <div class="timeline" aria-label="传统竞品分析流程">
              <div class="timeline-item"><strong>打开十几个网页</strong><span>资料分散在不同地方</span></div>
              <div class="timeline-item"><strong>一点点复制下来</strong><span>信息先被搬运，再被理解</span></div>
              <div class="timeline-item"><strong>形成自己的判断</strong><span>两天，换来一份可讨论的初稿</span></div>
            </div>
          </div>
          <div class="story-foot"><span>工具是工具，人是人。</span><span>← 还没有魔法</span></div>
        </div>
      </section>

      <section class="slide story-slide deck-dark" data-auto-animate>
        <div class="story-shell">
          <div class="story-topline"><span>01 / 一个很小的场景</span><span>B · 看变化</span></div>
          <div class="scene-grid scene-grid--wide">
            <div>
              <div class="scene-label">今天 · 同一个人</div>
              <h2 class="scene-heading">两个小时，已经有了第一版。</h2>
              <p class="scene-copy">AI先整理行业、竞品、商业模式和用户评价。人仍然要核实、判断、修改。</p>
            </div>
            <div>
              <p class="big-number" data-id="clock">2<small>小时</small></p>
              <div class="rule"></div>
              <p class="story-subtitle" data-id="work-change">过去两天的工作，被压缩成一次人与AI的协作。</p>
            </div>
          </div>
          <div class="story-foot"><span>AI没有替他做决定，但让他更快抵达决定之前。</span><span>10× 更快</span></div>
        </div>
      </section>

      <section class="slide story-slide deck-warm story-slide--center">
        <div class="story-shell" style="justify-content:center;align-items:center;text-align:center">
          <div class="story-topline" style="width:100%;position:absolute;top:0"><span>01 / 一个很小的场景</span><span>A · 停一下</span></div>
          <p class="quote">听起来很好，对吧？<br><span class="accent">但周三还没到。</span></p>
        </div>
      </section>

      <section class="slide story-slide deck-dark">
        <div class="story-shell">
          <div class="story-topline"><span>02 / 组织堵住了</span><span>B · 看见等待</span></div>
          <div class="scene-grid">
            <div>
              <div class="scene-label">一份已经完成的方案</div>
              <h2 class="scene-heading">两个小时的工作，跑进了三个星期的组织。</h2>
            </div>
            <div class="timeline">
              <div class="timeline-item fragment"><strong>等周三评审</strong><span>会议是固定的，问题不是</span></div>
              <div class="timeline-item fragment"><strong>等另一个部门确认</strong><span>信息开始串行传递</span></div>
              <div class="timeline-item fragment"><strong>等财务下一个周期</strong><span>预算窗口已经关了</span></div>
            </div>
          </div>
          <div class="story-foot"><span>任务变快了，组织没有。</span><span>2h → 3 weeks</span></div>
        </div>
      </section>

      <section class="slide story-slide deck-paper">
        <div class="story-shell">
          <div class="story-topline"><span>02 / 组织堵住了</span><span>A · 追问</span></div>
          <div>
            <p class="scene-label">效率去了哪里？</p>
            <h2 class="scene-heading" style="max-width:16ch">它消失在等待、审批、交接、会议里。</h2>
          </div>
          <div class="sinks">
            <div class="sink fragment"><strong>等待</strong><span>做完了，却不能继续往下走</span></div>
            <div class="sink fragment"><strong>审批</strong><span>决定权离工作现场很远</span></div>
            <div class="sink fragment"><strong>交接</strong><span>每一次传递都丢失上下文</span></div>
            <div class="sink fragment"><strong>“谁说了算”</strong><span>责任和权限没有对齐</span></div>
          </div>
          <div class="story-foot"><span>个人效率 ≠ 企业生产力</span><span>组织是乘数，也是瓶颈</span></div>
        </div>
      </section>

      <section class="slide story-slide deck-dark story-slide--center">
        <div class="story-shell" style="justify-content:center;align-items:center;text-align:center">
          <div class="story-topline" style="width:100%;position:absolute;top:0"><span>03 / 不是工具，是前提</span><span>B · 转场</span></div>
          <p class="quote">AI真正改变的，<br>不是某个岗位。<br><span class="accent">是组织成立的前提。</span></p>
        </div>
      </section>

      <section class="slide story-slide deck-paper" data-auto-animate>
        <div class="story-shell">
          <div class="story-topline"><span>03 / 生产单元变了</span><span>A · 过去</span></div>
          <div class="scene-grid scene-grid--wide">
            <div>
              <div class="scene-label">过去 · 能力边界</div>
              <h2 class="scene-heading">一个人，通常只拥有一种主要能力。</h2>
              <p class="scene-copy">研究、设计、写作、分析、开发被拆开，再用协调者把它们串起来。</p>
            </div>
            <div class="unit-stage" aria-label="过去的专业分工">
              <div class="unit-node person" data-id="person">产品</div>
              <div class="unit-node ai" data-id="specialist-a">研究</div>
              <div class="unit-node knowledge" data-id="specialist-b">工程</div>
              <div class="unit-caption">Department / 分工</div>
            </div>
          </div>
          <div class="story-foot"><span>分工，是对个人能力边界的补偿。</span><span>人 → 岗位</span></div>
        </div>
      </section>

      <section class="slide story-slide deck-dark" data-auto-animate>
        <div class="story-shell">
          <div class="story-topline"><span>03 / 生产单元变了</span><span>B · 现在</span></div>
          <div class="scene-grid scene-grid--wide">
            <div>
              <div class="scene-label">未来 · 工作单元</div>
              <h2 class="scene-heading">一个人，开始像一个小团队。</h2>
              <p class="scene-copy">完整的生产单元不再只是一个人，而是：人 + AI + 企业知识 + 工具权限。</p>
            </div>
            <div class="unit-stage" aria-label="未来的人与AI生产单元">
              <div class="unit-line one" data-id="line-one"></div><div class="unit-line two" data-id="line-two"></div>
              <div class="unit-node person" data-id="person">人</div>
              <div class="unit-node ai" data-id="specialist-a">AI组</div>
              <div class="unit-node knowledge" data-id="specialist-b">知识+权限</div>
              <div class="unit-caption">Mission / 问题</div>
            </div>
          </div>
          <div class="story-foot"><span>第一变化：组织里的最小生产单元开始变化。</span><span>人 + 一组AI</span></div>
        </div>
      </section>

      <section class="slide story-slide deck-warm">
        <div class="story-shell">
          <div class="story-topline"><span>04 / 增长不再等于加人</span><span>A · 管理直觉</span></div>
          <div class="scene-grid">
            <div>
              <div class="scene-label">过去的第一反应</div>
              <h2 class="scene-heading">客户多了？需求复杂了？<br>加人。</h2>
              <p class="scene-copy">未来，管理者会先问：能不能增加一个Agent，接上一段工作流？</p>
            </div>
            <div class="output-field">
              <div class="output-chip fragment">资料整理</div><div class="output-chip fragment">数据监控</div><div class="output-chip fragment">第一轮测试</div><div class="output-chip fragment">汇总提醒</div>
            </div>
          </div>
          <div class="story-foot"><span>业务规模与员工数量之间的线，会逐渐松开。</span><span>Scale ≠ Headcount</span></div>
        </div>
      </section>

      <section class="slide story-slide deck-dark">
        <div class="story-shell">
          <div class="story-topline"><span>05 / 生成之后</span><span>B · 视觉隐喻</span></div>
          <div class="scene-grid">
            <div>
              <div class="scene-label">高速公路</div>
              <h2 class="scene-heading">每辆车都变快了，路会自动变快吗？</h2>
              <p class="scene-copy">如果出口、收费站和道路规则都没有改变，速度提升可能只会把堵车推到更前面。</p>
            </div>
            <div class="highway-stage" aria-label="车辆变快但收费站成为瓶颈">
              <div class="lane l1"></div><div class="lane l2"></div><div class="lane l3"></div>
              <div class="car c1">×3</div><div class="car c2">×3</div><div class="car c3">×3</div>
              <div class="toll"></div><div class="toll-label">出口 / 决策</div>
            </div>
          </div>
          <div class="story-foot"><span>个人效率提升，可能把组织瓶颈照得更亮。</span><span>出口没有变</span></div>
        </div>
      </section>

      <section class="slide story-slide deck-paper">
        <div class="story-shell">
          <div class="story-topline"><span>05 / 生成之后</span><span>A · 核心转折</span></div>
          <div class="scene-grid scene-grid--wide">
            <div>
              <div class="scene-label">稀缺性转移</div>
              <h2 class="scene-heading">过去是做不出来。<br>未来是选不过来。</h2>
              <p class="scene-copy">AI首先提高生成能力。生成越便宜，判断、优先级与责任就越贵。</p>
            </div>
            <div>
              <div class="output-field">
                <div class="output-chip">方案 01</div><div class="output-chip">方案 02</div><div class="output-chip">方案 03</div><div class="output-chip">方案 04</div>
                <div class="output-chip">创意 A</div><div class="output-chip">创意 B</div><div class="output-chip">代码 C</div><div class="output-chip">报告 D</div>
              </div>
              <div class="decision-funnel"><span>生成能力爆炸</span><span>判断 / 责任</span></div>
            </div>
          </div>
          <div class="story-foot"><span><strong>决策过载</strong> 会成为新的组织矛盾。</span><span>做得更多 ≠ 选得更好</span></div>
        </div>
      </section>

      <section class="slide story-slide deck-warm">
        <div class="story-shell">
          <div class="story-topline"><span>06 / 管理者的价值迁移</span><span>A · 角色变化</span></div>
          <div>
            <div class="scene-label">管理工作，曾经是信息搬运</div>
            <h2 class="scene-heading" style="max-width:18ch">从“我知道每个项目到哪了”<br>到“我设计系统如何行动”。</h2>
          </div>
          <div class="manager-split">
            <div class="manager-card old fragment"><h3>任务管理者</h3><p>安排任务<br>追进度<br>开会汇总<br>写周报<br>催责任人</p></div>
            <div class="manager-card new fragment"><h3>系统设计者</h3><p>定义目标<br>设计人与AI的协作边界<br>决定什么可以自动化<br>保留什么必须由人判断</p></div>
          </div>
          <div class="story-foot"><span>优秀管理者不会消失，价值会向更高层迁移。</span><span>Task manager → System designer</span></div>
        </div>
      </section>

      <section class="slide story-slide deck-paper">
        <div class="story-shell">
          <div class="story-topline"><span>07 / 层级的理由</span><span>B · 看见系统</span></div>
          <div class="scene-grid scene-grid--wide">
            <div>
              <div class="scene-label">传统层级组织</div>
              <h2 class="scene-heading">金字塔不仅是权力结构，也是信息压缩系统。</h2>
              <p class="scene-copy">五千人的一千件事，被压缩成一页PPT、三个数字，再传到CEO面前。</p>
            </div>
            <div>
              <div class="pyramid"><div class="pyramid-row r1">CEO</div><div class="pyramid-row r2">总监</div><div class="pyramid-row r3">经理</div><div class="pyramid-row r4">一线发生的事</div></div>
              <div class="direct-query fragment">如果AI可以直接读懂客户、项目和风险，信息还必须逐层上传吗？</div>
            </div>
          </div>
          <div class="story-foot"><span>每一层管理，都需要重新证明自己的价值。</span><span>Information compression</span></div>
        </div>
      </section>

      <section class="slide story-slide deck-dark" data-auto-animate>
        <div class="story-shell">
          <div class="story-topline"><span>08 / 从部门到任务</span><span>A · 重组</span></div>
          <div class="scene-grid scene-grid--wide">
            <div>
              <div class="scene-label">组织的新问题</div>
              <h2 class="scene-heading">你属于哪个部门？<br>可能不再是最重要的问题。</h2>
              <p class="scene-copy">更重要的是：你现在正在解决什么问题？</p>
            </div>
            <div class="network-stage" aria-label="部门网络">
              <div class="net-line l1" data-id="net-l1"></div><div class="net-line l2" data-id="net-l2"></div><div class="net-line l3" data-id="net-l3"></div><div class="net-line l4" data-id="net-l4"></div>
              <div class="net-node n1" data-id="net-a">市场</div><div class="net-node n2" data-id="net-b">产品</div><div class="net-node n3" data-id="net-c">研发</div><div class="net-node n4" data-id="net-d">财务</div>
            </div>
          </div>
          <div class="story-foot"><span>Department / 部门是静态的。</span><span>问题还没有出现</span></div>
        </div>
      </section>

      <section class="slide story-slide deck-dark" data-auto-animate>
        <div class="story-shell">
          <div class="story-topline"><span>08 / 从部门到任务</span><span>B · 临时组队</span></div>
          <div class="scene-grid scene-grid--wide">
            <div>
              <div class="scene-label">一个客户问题出现</div>
              <h2 class="scene-heading">人和Agent，围绕Mission动态组合。</h2>
              <p class="scene-copy">客户Agent读历史，数据Agent找异常，产品判断问题，工程检查成本，法务守住边界。</p>
            </div>
            <div class="network-stage" aria-label="围绕客户问题临时组合的人和Agent">
              <div class="net-line l1" data-id="net-l1"></div><div class="net-line l2" data-id="net-l2"></div><div class="net-line l3" data-id="net-l3"></div><div class="net-line l4" data-id="net-l4"></div>
              <div class="net-node n1" data-id="net-a">客户<br>Agent</div><div class="net-node n2" data-id="net-b">数据<br>Agent</div><div class="net-node n3" data-id="net-c">产品<br>判断</div><div class="net-node n4" data-id="net-d">工程 /<br>法务</div>
            </div>
          </div>
          <div class="story-foot"><span><strong>Mission / 任务</strong> 成为新的组织基本结构。</span><span>解决后，结构解散</span></div>
        </div>
      </section>

      <section class="slide story-slide deck-warm story-slide--center">
        <div class="story-shell" style="justify-content:center;align-items:center;text-align:center">
          <div class="story-topline" style="width:100%;position:absolute;top:0"><span>09 / 一个危险的误区</span><span>A · 呼吸</span></div>
          <p class="quote">AI解决的是<br><span class="accent">能力问题。</span><br>组织还要面对目标、信任、责任与价值。</p>
        </div>
      </section>

      <section class="slide story-slide deck-dark">
        <div class="story-shell">
          <div class="story-topline"><span>09 / 一个危险的误区</span><span>B · 边界问题</span></div>
          <div class="scene-grid">
            <div>
              <div class="scene-label">不要把AI当裁员按钮</div>
              <h2 class="scene-heading">机器可以给出十个方案，但不能替公司承担战略失败。</h2>
            </div>
            <div>
              <div class="governance-grid">
                <div class="fragment"><b>目标</b>什么值得解决？</div><div class="fragment"><b>信任</b>谁相信结果？</div><div class="fragment"><b>责任</b>谁对结果负责？</div><div class="fragment"><b>风险</b>哪里必须停下？</div><div class="fragment"><b>价值</b>冲突如何选择？</div>
              </div>
            </div>
          </div>
          <div class="story-foot"><span>人没有变得不重要，而是被迫向更高层移动。</span><span>Human judgment stays</span></div>
        </div>
      </section>

      <section class="slide story-slide deck-paper">
        <div class="story-shell">
          <div class="story-topline"><span>10 / 人重新承担什么</span><span>A · 重新定义岗位</span></div>
          <div>
            <div class="scene-label">当写作、编程、搜索、分析都变便宜</div>
            <h2 class="scene-heading" style="max-width:17ch">岗位不再主要围绕任务定义，而围绕结果定义。</h2>
          </div>
          <div class="manager-split">
            <div class="manager-card old fragment"><h3>过去的岗位描述</h3><p>负责市场研究<br>负责竞品分析<br>负责报告撰写<br>负责数据整理</p></div>
            <div class="manager-card new fragment"><h3>未来的责任边界</h3><p>发现值得解决的问题<br>判断什么是重要的<br>在不确定性里做选择<br>对结果负责</p></div>
          </div>
          <div class="story-foot"><span>任务会越来越便宜，结果不会。</span><span>Task → Outcome</span></div>
        </div>
      </section>

      <section class="slide story-slide deck-dark">
        <div class="story-shell">
          <div class="story-topline"><span>11 / 重新画边界</span><span>B · 组织设计</span></div>
          <div class="scene-grid scene-grid--wide">
            <div>
              <div class="scene-label">真正需要重新设计的</div>
              <h2 class="scene-heading">不是某一个软件，也不只是某一个岗位。</h2>
              <p class="scene-copy">而是人和机器之间的边界：权限、决策、停机、升级、责任。</p>
            </div>
            <div class="governance-grid">
              <div class="fragment"><b>访问什么</b>数据边界</div><div class="fragment"><b>调用什么</b>工具边界</div><div class="fragment"><b>做到哪步</b>权限边界</div><div class="fragment"><b>何时停下</b>控制边界</div><div class="fragment"><b>错了算谁</b>责任边界</div>
            </div>
          </div>
          <div class="story-foot"><span>这些表面上像技术问题，实际上全部是组织设计问题。</span><span>Human / Agent boundary</span></div>
        </div>
      </section>

      <section class="slide story-slide deck-paper" data-auto-animate>
        <div class="story-shell">
          <div class="story-topline"><span>12 / 回到产品经理</span><span>A · 旧组织</span></div>
          <div class="scene-grid">
            <div>
              <div class="scene-label">同一个人 · 同一份分析</div>
              <h2 class="scene-heading">AI让报告更快，但旧组织只会让他更快地等待。</h2>
            </div>
            <div><p class="big-number paper-number" data-id="old-outcome">3<small>周</small></p><div class="rule"></div><p class="story-copy" style="font-size:1rem;letter-spacing:0;text-transform:none;color:rgba(23,25,24,.58)">两个小时做完第一版<br>然后等待评审、确认、预算</p></div>
          </div>
          <div class="story-foot"><span>局部跑得更快，整体没有改变。</span><span>AI × 旧工作流</span></div>
        </div>
      </section>

      <section class="slide story-slide deck-dark" data-auto-animate>
        <div class="story-shell">
          <div class="story-topline"><span>12 / 回到产品经理</span><span>B · 新组织</span></div>
          <div class="scene-grid">
            <div>
              <div class="scene-label">并行发生</div>
              <h2 class="scene-heading">真正的数量级提升，来自组织围绕AI重写工作方式。</h2>
              <p class="scene-copy">研究、验证、原型、成本判断同时发生；重大预算、战略、法律风险才进入人的正式决策。</p>
            </div>
            <div><p class="big-number" data-id="old-outcome">3<small>天</small></p><div class="rule"></div><p class="story-subtitle" data-id="parallel-copy">不是报告写得更快，而是串行工作变成了并行协作。</p></div>
          </div>
          <div class="story-foot"><span>2小时的初稿，终于有机会变成企业的生产力。</span><span>AI × 新工作流</span></div>
        </div>
      </section>

      <section class="slide story-slide deck-dark">
        <div class="story-shell">
          <div class="story-topline"><span>13 / 变化的顺序</span><span>A · 母叙事弧</span></div>
          <div>
            <div class="scene-label">从个人能力走向组织重构</div>
            <h2 class="scene-heading" style="max-width:16ch">变化不是买一个AI软件。<br>变化是一条链。</h2>
          </div>
          <div class="sequence">
            <div class="sequence-step fragment"><strong>个人</strong><span>先获得AI能力</span></div><div class="sequence-step fragment"><strong>工作流</strong><span>瓶颈转移到协作</span></div><div class="sequence-step fragment"><strong>角色</strong><span>边界与责任重写</span></div><div class="sequence-step fragment"><strong>结构</strong><span>层级和部门松动</span></div><div class="sequence-step fragment"><strong>人的价值</strong><span>重新回答“该做什么”</span></div>
          </div>
          <div class="story-foot"><span>组织变革不是AI项目的附属品，而是AI项目的终点。</span><span>个人 → 组织 → 人</span></div>
        </div>
      </section>

      <section class="slide story-slide deck-paper story-slide--center">
        <div class="story-shell" style="justify-content:center;align-items:center;text-align:center">
          <div class="story-topline" style="width:100%;position:absolute;top:0"><span>14 / 留给今天的问题</span><span>B · 结尾</span></div>
          <p class="question-mark">?</p>
          <p class="quote" style="max-width:18ch;margin-top:2rem">如果今天从零开始创建这家公司，<br><span class="accent">我们还会把它设计成现在这样吗？</span></p>
          <div class="story-foot" style="width:100%;position:absolute;bottom:0"><span>AI时代最大的组织变革</span><span>人到底应该做什么</span></div>
        </div>
      </section>
    </div>
  </div>

  <!-- === REVEAL CORE JS: inlined from dist/reveal.js === -->
  <script>
${inlineJs('assets/reveal/reveal.js')}
  </script>

  <!-- === BUILT-IN PLUGINS: inline only the capabilities used by this deck === -->
  <script>
${inlineJs('assets/reveal/plugin/markdown.js')}
  </script>
  <script>
${inlineJs('assets/reveal/plugin/highlight.js')}
  </script>

  <!-- === CUSTOM NAVIGATION: source is kept unchanged in minimap/ === -->
  <script>
${inlineJs('assets/minimap.js')}
  </script>

  <!-- === REVEAL BOOTSTRAP === -->
  <script>
    (function () {
      'use strict';

      var config = {
        width: 1600,
        height: 900,
        margin: 0.06,
        minScale: 0.2,
        maxScale: 2.0,
        hash: true,
        hashOneBasedIndex: false,
        transition: 'slide',
        transitionSpeed: 'default',
        backgroundTransition: 'fade',
        controls: true,
        controlsLayout: 'bottom-right',
        controlsBackArrows: 'visible',
        progress: true,
        slideNumber: false,
        showSlideNumber: 'all',
        keyboard: true,
        touch: true,
        overview: true,
        center: true,
        fragments: true,
        fragmentInURL: true,
        help: true,
        pause: true,
        plugins: [RevealMarkdown, RevealHighlight]
      };

      var ready = Reveal.initialize(config);
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
