---
name: steve-storytelling-ppt-skill
description: Build, edit, debug, and regenerate Steve's Reveal.js presentation as a timestamped offline self-contained HTML file. Use for slide content, Reveal configuration, white theme, bundled plugins, custom Minimap navigation, or generating a deck in this Skill's output folder. Do not use for PPTX, Keynote, or unrelated web pages.
---

# Steve Storytelling PPT

Maintain the project-local Reveal.js deck from bundled assets and produce one offline HTML artifact.

## Workflow

1. Read [references/workflow.md](references/workflow.md).
2. Inspect `scripts/build-self-contained-deck.js` and only the assets relevant to the request.
3. Edit slide content, custom styles, theme slot, or Reveal configuration in the builder.
4. Edit `assets/minimap.js` only when the request concerns Minimap behavior or appearance.
5. Build to a temporary path first:

   ```bash
   node steve-storytelling-ppt-skill/scripts/build-self-contained-deck.js /private/tmp/reveal-self-contained-smoke.html
   ```

6. Verify the temporary HTML is non-empty, has no external runtime references, and contains Reveal, Markdown, Highlight, and Minimap code.
7. Generate the deliverable:

   ```bash
   node steve-storytelling-ppt-skill/scripts/build-self-contained-deck.js
   ```

## Output Contract

- Default output directory: `/Users/steve/project/PPT/steve-storytelling-ppt-skill/output/`.
- Default filename: `reveal-self-contained-YYYY-MM-DD-HH-mm.html`, using local system time.
- Deliver one browser-openable HTML file with required CSS and JavaScript inlined.
- Build only from this Skill's `assets/`; never read the project's external `dist/` or `minimap/` folders.
- Preserve user-authored files outside this Skill unless the request explicitly targets them.

## Boundaries

- Owns the self-contained Reveal.js HTML workflow in this project.
- Does not create `.pptx` or Keynote files.
- Does not redesign the theme or Minimap unless requested.
- Does not fetch CDN assets unless explicitly authorized.
