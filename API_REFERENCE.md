# Browser Extension API Reference

This reference covers common Manifest V3 permissions and WebExtension APIs. The examples use:

```js
const extensionApi = globalThis.browser ?? globalThis.chrome;
```

Firefox generally exposes promise-based `browser.*` APIs. Chromium exposes `chrome.*`; newer Chromium versions support promises for many APIs, while callback syntax remains supported in more places. Check the target browser's documentation when portability matters.

## Common permissions

Request the smallest set needed. Permissions are visible to users and can affect review or installation.

| Permission | Enables | Typical use |
| --- | --- | --- |
| `storage` | `storage.local`, `storage.sync`, and `storage.session` | Preferences, cached data, settings |
| `activeTab` | Temporary access to the active tab after a user gesture | Inspect or modify the current page without broad host access |
| `tabs` | Sensitive tab fields such as URL, title, and favicon | Read tab metadata or manage tabs |
| `scripting` | `scripting.executeScript`, `insertCSS`, and `removeCSS` | Inject scripts or styles programmatically |
| `alarms` | Scheduled background events | Polling, reminders, periodic cleanup |
| `notifications` | Desktop notifications | Status or action notifications |
| `contextMenus` | Browser context-menu items | Actions for selected text, links, or pages |
| `cookies` | Cookie access for permitted hosts | Account/session integrations |
| `downloads` | Start and manage downloads | Export files or save generated content |
| `webNavigation` | Navigation lifecycle events | Track navigation without reading page content |
| `unlimitedStorage` | More than the normal storage quota | Large local caches (use sparingly) |

### Host permissions

Host permissions are URL patterns, for example:

```json
{
  "host_permissions": ["https://*.example.com/*"]
}
```

Use `"<all_urls>"` only when necessary. `activeTab` is often a safer alternative for a user-triggered action. Host permissions may enable `tabs` URL access, content-script injection, and cross-origin requests depending on the API and browser.

## Runtime messaging

### `runtime.sendMessage(message, options?)`

Sends a one-off message to extension contexts.

- **Arguments:** `message: any`, optional `options: object`
- **Returns:** `Promise<any>` in promise-based implementations; Chromium callback form receives `(response: any)`

```js
const response = await extensionApi.runtime.sendMessage({
  type: "SAVE_SETTING",
  key: "enabled",
  value: true
});
```

Listen with `runtime.onMessage.addListener(listener)`. The listener receives `(message: any, sender: MessageSender, sendResponse: function): boolean | void`. Return `true` when responding asynchronously with `sendResponse`.

```js
extensionApi.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "PING") return false;
  sendResponse({ ok: true });
  return false;
});
```

### `tabs.sendMessage(tabId, message, options?)`

Sends a message to content scripts in a tab.

- **Arguments:** `tabId: number`, `message: any`, optional `options: { frameId?: number }`
- **Returns:** `Promise<any>` / callback response

```js
const [tab] = await extensionApi.tabs.query({ active: true, currentWindow: true });
const result = await extensionApi.tabs.sendMessage(tab.id, { type: "GET_PAGE_INFO" });
```

## Tabs

### `tabs.query(queryInfo)`

- **Arguments:** `queryInfo: object`, commonly `{ active?: boolean, currentWindow?: boolean, url?: string | string[] }`
- **Returns:** `Promise<Tab[]>` / callback `Tab[]`

```js
const tabs = await extensionApi.tabs.query({ active: true, currentWindow: true });
const currentUrl = tabs[0]?.url ?? null;
```

### `tabs.create(createProperties)`

- **Arguments:** `{ url?: string, active?: boolean, index?: number, openerTabId?: number }`
- **Returns:** `Promise<Tab>` / callback `Tab`

```js
const tab = await extensionApi.tabs.create({ url: "https://example.com", active: true });
```

### `tabs.update(tabId, updateProperties)`

- **Arguments:** `tabId: number`, `{ url?: string, active?: boolean, pinned?: boolean, muted?: boolean }`
- **Returns:** `Promise<Tab>` / callback `Tab`

```js
await extensionApi.tabs.update(tabId, { active: true });
```

## Storage

### `storage.local.get(keys?)` and `storage.local.set(items)`

- **Arguments:** `get`: `string | string[] | object | null`; `set`: `object`
- **Returns:** `Promise<object>` for `get`; `Promise<void>` for `set`

```js
await extensionApi.storage.local.set({ theme: "dark", enabled: true });
const settings = await extensionApi.storage.local.get(["theme", "enabled"]);
```

Use `storage.sync` for small settings synchronized across signed-in browser profiles, and `storage.session` for in-memory data when supported.

### `storage.onChanged.addListener(listener)`

- **Arguments:** `(changes: object, areaName: "local" | "sync" | "managed" | "session")`
- **Returns:** `void`

```js
extensionApi.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.theme) {
    console.log("Theme changed to", changes.theme.newValue);
  }
});
```

## Scripting

### `scripting.executeScript(injection)`

Requires `"scripting"` and a matching host permission or `activeTab`.

- **Arguments:** `{ target: { tabId: number, frameIds?: number[] }, func?: function, args?: any[], files?: string[] }`
- **Returns:** `Promise<InjectionResult[]>` / callback `InjectionResult[]`
- **Injection result:** `{ frameId: number, result: any }`

```js
const [tab] = await extensionApi.tabs.query({ active: true, currentWindow: true });
const results = await extensionApi.scripting.executeScript({
  target: { tabId: tab.id },
  func: (color) => {
    document.documentElement.style.outline = `4px solid ${color}`;
    return document.title;
  },
  args: ["rebeccapurple"]
});
console.log(results[0]?.result);
```

## Alarms

Requires `"alarms"`.

### `alarms.create(name, alarmInfo)`

- **Arguments:** `name?: string`, `{ when?: number, delayInMinutes?: number, periodInMinutes?: number }`
- **Returns:** `Promise<void>` or `void`, depending on browser

```js
await extensionApi.alarms.create("refresh-cache", { periodInMinutes: 30 });
```

### `alarms.onAlarm.addListener(listener)`

- **Arguments:** `(alarm: { name: string, scheduledTime: number, periodInMinutes?: number })`
- **Returns:** `void`

```js
extensionApi.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "refresh-cache") await refreshCache();
});
```

## Notifications

Requires `"notifications"`.

### `notifications.create(notificationId?, options)`

- **Arguments:** `notificationId?: string`, `{ type: "basic" | "image" | "list" | "progress", iconUrl: string, title: string, message: string, ... }`
- **Returns:** `Promise<string>` / callback notification ID

```js
const id = await extensionApi.notifications.create({
  type: "basic",
  iconUrl: "icons/icon128.png",
  title: "Complete",
  message: "Your export is ready."
});
```

## Context menus

Requires `"contextMenus"`.

### `contextMenus.create(createProperties)`

- **Arguments:** `{ id?: string, title: string, contexts: string[], documentUrlPatterns?: string[] }`
- **Returns:** `string` menu ID (or a promise in some implementations)

```js
extensionApi.contextMenus.create({
  id: "search-selection",
  title: "Search selection",
  contexts: ["selection"]
});
```

### `contextMenus.onClicked.addListener(listener)`

- **Arguments:** `(info: OnClickData, tab?: Tab)`
- **Returns:** `void`

```js
extensionApi.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "search-selection" && info.selectionText) {
    extensionApi.tabs.create({
      url: `https://www.google.com/search?q=${encodeURIComponent(info.selectionText)}`
    });
  }
});
```

## Windows

### `windows.create(createData)`

- **Arguments:** `{ url?: string | string[], type?: "normal" | "popup" | "panel", width?: number, height?: number, focused?: boolean }`
- **Returns:** `Promise<Window>` / callback `Window`

```js
await extensionApi.windows.create({
  url: "popup.html",
  type: "popup",
  width: 420,
  height: 600
});
```

## Fetching remote data

Use `fetch()` in the service worker for APIs allowed by `host_permissions`. Do not put secrets in an extension: users can inspect extension files and network requests.

```js
const response = await fetch("https://api.example.com/items");
if (!response.ok) {
  throw new Error(`Request failed: ${response.status}`);
}
const items = await response.json(); // Promise<any>
```

## Common event patterns

```js
extensionApi.runtime.onInstalled.addListener((details) => {
  // details.reason: "install" | "update" | "chrome_update" | ...
});

extensionApi.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    console.log("Loaded", tab.url);
  }
});

extensionApi.commands.onCommand.addListener((command) => {
  console.log("Command invoked:", command);
});
```

Add `"commands"` only when defining keyboard shortcuts in `manifest.json`.

## Portability checklist

- Prefer `globalThis.browser ?? globalThis.chrome`.
- Prefer promises and `async`/`await`; use callbacks when targeting older Chromium versions.
- Keep background code compatible with service workers: no `window`, DOM, or long-lived in-memory assumptions.
- Content scripts cannot directly access page JavaScript variables; use DOM events or `window.postMessage` when needed.
- Handle rejected promises and unavailable pages such as browser settings, the extension store, and PDF viewers.
- Test permissions and host patterns in every target browser.
