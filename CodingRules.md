# Obsidian Plugin Coding Rules

Condensed from [eslint-plugin-obsidianmd](https://github.com/obsidianmd/eslint-plugin). All rules below are in the `recommended` config unless noted.

## Commands (`addCommand()`)

- Don't include "command" in command `id` or `name` (redundant in command palette context)
- Don't include the plugin ID in command `id` (Obsidian namespaces automatically)
- Don't include the plugin name in command `name` (already shown in UI)
- Don't set default `hotkeys` — let users configure their own

## DOM & Styling

- **No `<style>` or `<link>` elements** — use `styles.css` (Obsidian loads it automatically)
- **No static inline styles** — use CSS classes instead. Dynamic values and CSS custom properties (`--my-var`) are OK:
  ```ts
  // BAD: el.style.color = "red"
  // GOOD: el.addClass("my-class")
  // GOOD: el.style.width = computedWidth  (dynamic)
  // GOOD: el.setCssProps({ "--my-var": value })
  ```

## Type Safety

- **No casting to `TFile`/`TFolder`** — use `instanceof` checks to narrow types
- **No `Object.assign(DEFAULT, data)`** — mutates defaults. Use `{ ...DEFAULT, ...data }` or 3-arg `Object.assign({}, DEFAULT, data)`

## Memory Leaks & Lifecycle

- **Don't call `detachLeavesOfType()` in `onunload()`** — it resets leaf positions on reload
- **Don't store view references on the plugin** — return views directly from `registerView()`
- **Don't pass plugin instance or bare `new Component()` to `MarkdownRenderer.render()`** — store the component in a variable so `unload()` can be called
- **Don't mark `onload()` as `async` unless it contains `await`**

## Preferred APIs

- **Platform detection:** use `Platform.isMacOS` / `Platform.isMobile`, not `navigator.userAgent`/`navigator.platform`
- **File lookup:** use `vault.getFileByPath(path)`, not `vault.getFiles().find(f => f.path === ...)`
- **Input suggestions:** use built-in `AbstractInputSuggest`, not custom `TextInputSuggest` with `createPopper`
- **File deletion:** prefer `fileManager.trashFile()` over `vault.trash()`/`vault.delete()` *(not in recommended, but good practice)*
- **Config path:** use `vault.configDir`, not hardcoded `".obsidian"`

## Regex (Mobile Compatibility)

- No regex lookbehinds (`(?<=...)`, `(?<!...)`) — unsupported on iOS < 16.4. Use capturing groups instead.

## Settings Tab

- Use `new Setting(containerEl).setName("...").setHeading()` for headings, not `createEl("h2")`
- Don't include "Settings", "Options", "General", or the plugin name in heading text

## UI Text

- Use **sentence case** for all user-facing strings (only first word capitalized)
  ```ts
  // BAD: "Enable Auto Save"
  // GOOD: "Enable auto save"
  ```

## manifest.json

- Required fields: `id`, `name`, `version`, `minAppVersion`, `description`, `author`, `isDesktopOnly`
- Don't use "obsidian" or "plugin" in `name`, `description`, or `id`
- Description: 10-250 chars, starts with capital letter, ends with period

## LICENSE

- Replace default "Dynalist Inc." with your actual name
- Keep copyright year current

## Template Cleanup

- Remove sample `registerInterval` / `registerDomEvent` calls from the plugin template
- Rename placeholder class names: `MyPlugin`, `SampleSettingTab`, `SampleModal`, etc.
