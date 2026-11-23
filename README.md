# Browser Extension Template

A minimal Manifest V3 starter for Chrome, Edge, Firefox, and other Chromium/WebExtension-compatible browsers.

## Customize

1. Change `name`, `version`, and `description` in `manifest.json`.
2. Replace the popup UI in `popup.html`, `popup.css`, and `popup.js`.
3. Add background behavior in `src/background.js`.
4. Add page behavior in `src/content-script.js`.
5. Add only the permissions and host permissions your feature needs.

## Load locally

### Chromium browsers

1. Open `chrome://extensions` or the equivalent extensions page.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select this repository folder.

### Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Choose **Load Temporary Add-on**.
3. Select `manifest.json`.

**New to extensions? Start with [docs/learning-path/00-start-here](docs/learning-path/00-start-here/README.md).**

See [`API_REFERENCE.md`](API_REFERENCE.md) for permissions, common APIs, signatures, return types, and examples.

## Copy-ready sample library

The repository contains two kinds of starting points:

- [`manifest.template.json`](manifest.template.json) is a field-rich manifest reference with placeholders. It is not meant to be loaded as-is; copy the fields you need into `manifest.json`.
- [`samples/manifests`](samples/manifests) contains smaller manifest variants to copy from.
- [`samples/content-scripts`](samples/content-scripts) contains isolated-world, main-world, DOM, CSS, iframe, and setup samples.
- [`samples/service-workers`](samples/service-workers) contains MV3 background/service-worker samples for messaging, alarms, menus, omnibox, downloads, storage, scripting, navigation, CDP debugging, CSP/header rules, offscreen documents, side panels, notifications, and web-accessible resources.
- [`chrome-extension-samples`](chrome-extension-samples) contains the complete official Chrome Extensions sample repository, including API-focused samples, functional samples, and archived MV2/Chrome Apps material.

The files in `samples/` are fragments to adapt, not extensions to load directly, and some have known problems: see [`samples/README.md`](samples/README.md). Prefer [`docs/SNIPPETS.md`](docs/SNIPPETS.md), whose code was run in Chromium.

## Official Chrome sample archive

The [`chrome-extension-samples`](chrome-extension-samples) directory is a snapshot of Google's official [Chrome extensions samples repository](https://github.com/GoogleChrome/chrome-extensions-samples).

- Snapshot commit: `7314683af84cf53179ee98fdaa0b24fd9326576a`
- Source: `https://github.com/GoogleChrome/chrome-extensions-samples.git`
- 304 `manifest.json` files are included: 300 strict-JSON manifests and 4 archived placeholder/commented manifests.
- The archive includes `api-samples`, `functional-samples`, `_archive/mv2`, `_archive/apps`, documentation, and project configuration.

## Beginner guides

| Guide | Use it to |
| --- | --- |
| [Start here](docs/learning-path/00-start-here/README.md) | Load, reload and debug your first extension |
| [Samples guide](docs/SAMPLES_GUIDE.md) | Know which nine of the 304 cloned Chrome samples to open, and in what order |
| [Learning path](docs/learning-path/README.md) | Build eight small extensions and a final project, with complete code |
| [Snippets](docs/SNIPPETS.md) | Copy a short recipe for one task |
