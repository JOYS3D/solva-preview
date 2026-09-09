# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The website for Solva, a one-person digital studio (Yanis Coolen) selling three things: websites, an AI phone assistant ("Solva Call"), and custom software. It is also the studio's portfolio — the `demos/` directory holds the working software that serves as proof.

## No build system — and that is deliberate

There is no `package.json`, no bundler, no dependencies, no test runner. Every page is a **single self-contained HTML file** with inlined `<style>` and `<script>`.

This is a hard constraint, not an accident: the owner does not code. He must be able to open any file in a browser, host it anywhere, and never run a build that could break. **Do not introduce a framework, a build step, or a package manager.** If a change seems to need one, it doesn't — write it in vanilla JS.

```bash
# Preview locally (any page)
python3 -m http.server 8000    # then http://localhost:8000

# Deploy — push to main IS the deploy
git push origin main           # → https://joys3d.github.io/solva-preview/

# Verify every page still returns 200 after a deploy
for u in "" solva-call/ custom-software/ demos/menuisier/ demos/tradiecatch/ \
         demos/poolflow/ demos/agencyos/ demos/ringback/ demos/restopilot/ \
         demos/briefimmo/ demos/copilot/ demos/menuisier/film/; do
  printf "%-28s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' \
    "https://joys3d.github.io/solva-preview/$u")"
done
```

GitHub Pages serves `main` at the repository root. There is no workflow file — the deploy is Pages' native branch build.

## Two layers that must not be merged

**Brand pages** — `index.html`, `solva-call/index.html`, `custom-software/index.html`. These share one design system and one voice. Changes to the look belong here, and should stay consistent across all three.

**Demos** — `demos/*/index.html`. Each is a finished, self-contained application with **its own** design system (none of them define the brand tokens). They predate the Solva brand and are shown as evidence of range. Do not restyle them to match the brand pages; their visual difference is the point. Treat each as frozen unless the task is specifically about that demo.

`demos/menuisier/` is the largest and is real client work (Le Petit Menuisier, a French joiner) — the canonical source lives at `~/petit-menuisier/index.html`, and this is a published copy.

## The design system (brand pages only)

Defined in `:root` at the top of each brand page, identical across all three. Editing one means editing all three.

- **Surfaces** `--paper --surface --sunk --deep` · **Text** `--ink --ink-2 --ink-3 --ink-4` (darkest → lightest) · **Rules** `--line --line-2`
- **Accent** `--co` (`#1B3FD1`) with `--co-d --co-l --co-bg --co-soft`
- **Semantic** `--ok` (success) `--urg` (urgent) `--warm`, each with a `-bg` pair
- **Depth** `--d1` → `--d4`, a four-step shadow ramp. Use the ramp; do not hand-write `box-shadow`.
- **Motion** `--e` and `--e-o` easing curves · **Radii** `--r-s --r --r-l --r-xl`
- **Type** Archivo (Google Fonts), the only external resource loaded.

### Dark mode is three-state — get this exactly right

The full light palette lives on bare `:root`. Only the tokens that change are redefined, in two places:

```css
@media (prefers-color-scheme:dark){ :root:not([data-theme="light"]){ /* … */ } }
:root[data-theme="dark"]{ /* same overrides — makes the manual toggle win */ }
```

Never give a colour its only definition inside a media query or a `[data-theme]` block.

### A page must never render blank

`<script>document.documentElement.classList.add('js')</script>` runs in `<head>`. Reveal animations are gated behind `.js`, so with JavaScript disabled everything is simply visible. On top of that, a **2500 ms `setTimeout` failsafe** force-adds the `.in` class to every target in case the `IntersectionObserver` never fires. `prefers-reduced-motion` is honoured via the `calme` constant, which skips observers entirely.

If you add a reveal-on-scroll element, wire it into the existing observers — do not add a new unguarded one.

## Claims discipline — the most important rule here

Australian Consumer Law s18 prohibits misleading conduct, and the ACCC actively sweeps this sector. Beyond the legal exposure, the site's entire argument rests on being the one vendor that doesn't make numbers up.

**Every figure on a brand page must have a linked primary source, or be explicitly labelled as rejected.**

The homepage deliberately *names and refuses* the industry's standard statistics — "$126,000 lost per year", "85% never call back", "82% call a competitor" — because each was traced to no primary source and is published almost exclusively by competitors selling the same product. That refusal is a selling point, and it appears in two places (around lines 476 and 538 of `index.html`).

**Adding any of those numbers as a supporting claim would invert the page's meaning.** If a figure is needed, find a primary source and link it, as is done with the [HBR lead-response study](https://hbr.org/2011/03/the-short-life-of-online-sales-leads). The interactive calculator exists so a visitor derives their own number instead of borrowing a fake one.

Also forbidden: invented clients, testimonials, client logos, ROI claims, or team members. Business names *inside demos* are invented and the homepage says so — that disclosure must stay. Le Petit Menuisier is the only real client shown, with permission.

**Never publish the ABN on the site.** The owner has ruled this out explicitly.

## Live state and pending work

- **Domain unresolved.** All fourteen `solva.X` TLDs are taken. A `mailto:` pointing at `solva.studio` — a third party's domain — was removed in `d21d235`; the CTA currently links to `#talk`. When a domain is bought, wire up the `mailto:`, the `og:url`/canonical, and the JSON-LD.
- **No `.com.au`.** Since 20 May 2026 auDA blocks renewal and auto-deletes when the registrant's ABN lapses. The owner leaves Australia around March 2027.
- **Geography is a variable.** "Brisbane" and Australian figures appear ~30 times across the three brand pages, including the JSON-LD `address`/`areaServed`. Keep new geographic references concentrated rather than scattered — the site is expected to re-point to France.
- **Forms do not submit.** No backend is wired yet.
- The **Websites** pillar has no page yet; `solva-call/` and `custom-software/` are built.

## Conventions

- Site copy is **British-inflected English**; commit messages are **French**. Follow both.
- Copy uses HTML entities for typography (`&rsquo; &ldquo; &middot; &mdash;`) rather than raw glyphs.
- `refs/` is gitignored. It is a drop folder: macOS TCC blocks Claude Code from reading the owner's Desktop, so files for Claude to read are placed there instead.
- `assets/marketing/` holds standalone SVGs. When inlining more than one SVG into a single page, **prefix every `id`** on filters and gradients per-source — duplicate IDs across inlined SVGs silently break rendering.
