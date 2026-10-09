# Module renderers

_Plan 01. 2026-10-07. Proposed; nothing here is built. Written from the Menagerie side (arfct/menagerie, plans 13 and 27), which borrowed itty-bitty's renderer contract and then extended it. This plan is how itty-bitty takes the extension back, so one renderer runs on both sites unchanged. A larger itty-bitty upgrade is expected later; this is the piece of it that affects renderers._

## The contract today

A renderer under `docs/render/` is a classic script. The host page (`docs/render.js`, loaded in the sandboxed iframe, or the page itself on a watch) sets `window.params` (`body`, `script`, `origin`, `originalURL`, and whatever the link carried), puts `window.el` in place, appends a `<base href>` pointing at the script, and loads the script with `loadScript(data.script)`. The script runs its top level as it loads, reads `window.params`, and draws into `document.body`. Some renderers (`recipe.html`) are HTML pages that inline their script and style and call a `render()` function from the `message` listener themselves.

What the contract leaves to the script: when to draw, where to draw, how to react to a second message (nothing; a second `loadScript` appends a second copy), themes, and any way to talk back to the host.

## The contract Menagerie added

Menagerie kept everything above and added one shape a renderer may take instead:

```js
export default function mount(host, params, port) {
  // draw into host; return a handle
  return { update(params) {}, unmount() {}, focus(id) {} };
}
```

- `host` is the element to draw into: `document.body` in a frame, a `div` the product owns when the renderer runs in the page.
- `params` is `window.params` with a few named fields: `media_type`, `subtype`, `title`, `theme` (`light` or `dark`), `mode` (`one`, `many`, `preview`, `edit`), `body` or `items`, `base` (where the host's assets live), `frame` (true inside an iframe), `readonly`.
- `port.post(message)` is the way back: `{ rendered: true }`, `{ resize: px }`, `{ select: id }`, `{ draft: { body, title } }`, `{ image: Blob }`.
- `update(params)` carries a theme change or a new body without reloading; `unmount()` releases what `mount` took.

The host decides trust: a module that only builds DOM from its bytes (with `el`, which drops non-web `href` and `src`) may run in the page; one that runs content stays in the frame. The same module file serves both. Registration is one JSON file keyed by media type with itty-bitty's fallback chain (`type;subtype`, `type`, `application/json` for `+json`, `text/plain` for `text/*`, `*/*`).

## What itty-bitty changes

1. **`docs/render.js` learns the module path.** After `loadScript(data.script)` resolves (as a module, which `loadScript` already defaults to), if the module has a default export, call `mount(document.body, window.params, { post: (m) => parent.postMessage(m, "*") })` and keep the handle; a later `message` goes to `handle.update(params)` instead of a second `loadScript`. If there is no default export but `window.render` is a function, call it once (this is what `recipe.html` does inline; the renderer page can do it for every classic script). Otherwise the script drew itself at load, as today. Three branches, nothing removed.

   `loadScript` uses `onload`, which gives no handle to the module's exports. The module branch needs `import(data.script)` instead, which is what Menagerie's frame does; classic scripts keep `loadScript`. A script's shape could be declared in the registry (`module: true`) or found by trying `import()` first and falling back; the registry is cheaper and the list is short.

2. **The registry in `docs/index.js` grows the fields the module contract reads.** `renderers` there is a plain object of `{ script, sandbox, args }`. Each entry may add `modes` and `trust`; the lookup gains the fallback chain (today it is an exact match on `durl.mediatype`, with `text/plain` and `text/html` special-cased around it). Menagerie's `renderers/src/registry.js` is 46 lines and could be copied as is.

3. **`params` gains `theme`, `mode`, `base`, and `frame`.** `renderContentWithScript` sets them: `theme` from `prefers-color-scheme`, `mode` always `one` here (itty-bitty shows one thing), `base` the origin, `frame` true. Classic scripts ignore them.

4. **`recipe.js` becomes the first module.** Menagerie's plan 27 ports it to the module shape (page-trusted there, since it runs no content); the ported file comes back here as `docs/render/recipe.js`, and `recipe.html` becomes unnecessary once the renderer page calls `render()` or `mount()` itself. The attribution stays with the file. The parts Menagerie dropped (share link, QR, watch layout, wake lock) are itty-bitty features and would come back as a thin wrapper around the module, or as `params` the module reads (`originalURL` for the share link).

5. **`el` converges.** Both sites' `el` are the same function with one difference: Menagerie's drops any `href` or `src` that is not `http(s):`, `mailto:`, `data:image/`, or `blob:`, and has no `el.trust` in the page. itty-bitty's frame can adopt the scheme check without loss (nothing legitimate in a renderer links to `javascript:`) and keep `el.trust` for the frame. One file, vendored both ways or published.

## What it buys

- A renderer written once runs on itty.bitty.app (frame), in Menagerie's frame, and in Menagerie's page.
- Menagerie stops vendoring itty-bitty renderers; it imports them, or the two share a package.
- itty-bitty renderers get `update` (theme changes without reload), a way to size the frame (`resize`), and a way to say they are done (`rendered`), none of which the classic shape has.

## Not in this plan

The link format (`data:` URL in the fragment, LZMA or gzip, `format=` marker) is unchanged; Menagerie's `scripts/link.js` reads it as is. The edit page, the history page, the sandbox subdomains, and the watch's overwrite mode are untouched. Whether itty-bitty should publish `el` and the registry lookup as a package is a question for the larger upgrade.
