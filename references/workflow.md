# Build and Maintenance Workflow

## Package Layout

```text
steve-storytelling-ppt-skill/
├── SKILL.md
├── assets/
│   ├── minimap.js
│   └── reveal/
│       ├── reset.css
│       ├── reveal.css
│       ├── reveal.js
│       ├── theme/white.css
│       └── plugin/
│           ├── highlight.js
│           └── markdown.js
├── references/workflow.md
├── scripts/build-self-contained-deck.js
└── output/
    └── reveal-self-contained-YYYY-MM-DD-HH-mm.html
```

`assets/` contains static files copied into the generated artifact. `scripts/` contains deterministic assembly logic. Do not recreate a package-level `dist/` directory.

## Source Ownership

- Slide markup, custom layout, style overrides, theme inclusion, and Reveal initialization live in `scripts/build-self-contained-deck.js`.
- Custom navigation lives in `assets/minimap.js`.
- Reveal core and plugin files live below `assets/reveal/`.
- Files generated below `output/` are timestamped output artifacts, not the durable source of truth.

## Assembly Order

The builder inlines resources in this order:

1. `assets/reveal/reset.css`
2. `assets/reveal/reveal.css`
3. `assets/reveal/theme/white.css`
4. custom styles and slide HTML
5. `assets/reveal/reveal.js`
6. `assets/reveal/plugin/markdown.js`
7. `assets/reveal/plugin/highlight.js`
8. `assets/minimap.js`
9. `Reveal.initialize(...)`

The builder escapes literal closing `style` and `script` tags before embedding vendor content.

## Reveal Defaults

Preserve these unless the user asks for a change:

- canvas: `1600 × 900`
- transition: `slide`
- background transition: `fade`
- controls: enabled, bottom-right
- back arrows: visible
- progress: enabled
- slide number: disabled
- hash, keyboard, touch, overview, fragments, help, and pause: enabled
- plugins: Markdown and Highlight

## Minimap Guardrails

- Keep its interactive area inside the narrow right-side navigation strip.
- Do not cover Reveal's bottom-right controls.
- Trigger hover only when the pointer hits a real Minimap line.
- Do not add borders or glow around lines.
- Keep ordinary lines light gray and the current line dark unless requested otherwise.
- A hover-only size change must not alter the ordinary state.

## Verification

Use an explicit temporary output path before replacing the deliverable. Check that:

- the build exits successfully;
- the output exists and is non-empty;
- no `src` or `href` points to local Reveal files or a CDN;
- the document contains `Reveal.initialize`, `RevealMarkdown`, and `RevealHighlight`;
- Minimap and Reveal controls do not block each other's pointer events;
- the deck can navigate offline in a browser.

After verification, run the builder without an output argument. It creates `output/` when needed and writes a file named with local year, month, day, hour, and minute:

```text
/Users/steve/project/PPT/steve-storytelling-ppt-skill/output/reveal-self-contained-YYYY-MM-DD-HH-mm.html
```

For example: `reveal-self-contained-2026-09-01-19-58.html`.

## Failure Handling

- Missing asset: stop and report the exact path; do not silently fall back to external project files.
- Build error: keep the current deliverable untouched and diagnose the source asset or builder.
- Visual regression: compare the temporary build in the browser before replacing the deliverable.
- Requested Reveal upgrade: replace all related files in `assets/reveal/` together and rerun the complete verification.
