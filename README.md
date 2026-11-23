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

See [`API_REFERENCE.md`](API_REFERENCE.md) for permissions, common APIs, signatures, return types, and examples.
