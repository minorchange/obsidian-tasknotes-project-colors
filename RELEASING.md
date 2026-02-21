# Releasing a New Version

## Version numbers to update

Three files contain version numbers:

| File            | Field           | Example                                                         |
| --------------- | --------------- | --------------------------------------------------------------- |
| `manifest.json` | `version`       | `"1.2.0"`                                                       |
| `manifest.json` | `minAppVersion` | `"1.0.0"` (only bump if you use newer Obsidian APIs)            |
| `package.json`  | `version`       | `"1.2.0"`                                                       |
| `versions.json` | new entry       | `"1.2.0": "1.0.0"` (maps plugin version → min Obsidian version) |

Versions follow [semver](https://semver.org/): `MAJOR.MINOR.PATCH`
- **PATCH** (1.0.0 → 1.0.1): bug fixes
- **MINOR** (1.0.0 → 1.1.0): new features, backwards compatible
- **MAJOR** (1.0.0 → 2.0.0): breaking changes

## Step by step

```bash
# 1. Make your changes in src/main.ts, styles.css, etc.

# 2. Build and test locally
npm run build
# → Restart Obsidian (or Ctrl+R) and verify the plugin works

# 3. Update version numbers (example: bumping to 1.1.0)
#    - manifest.json  →  "version": "1.1.0"
#    - package.json   →  "version": "1.1.0"
#    - versions.json  →  add "1.1.0": "1.0.0"

# 4. Rebuild (so main.js reflects any changes)
npm run build

# 5. Commit everything
git add manifest.json package.json versions.json main.js styles.css src/
git commit -m "Release 1.1.0"

# 6. Tag (must match the version exactly, no "v" prefix)
git tag 1.1.0

# 7. Push
git push && git push --tags
```

The GitHub Action (`.github/workflows/release.yml`) will automatically create a GitHub Release with `main.js`, `manifest.json`, and `styles.css` attached. Obsidian checks GitHub Releases for updates, so users will see the new version in Settings → Community Plugins.

## First-time setup (initial publish)

1. Push the repo to GitHub as `minorchange/obsidian-tasknotes-project-colors`
2. Make sure **Issues** are enabled in the repo settings
3. Create the first release: `git tag 1.0.0 && git push --tags`
4. Wait for the GitHub Action to create the release
5. Fork [obsidianmd/obsidian-releases](https://github.com/obsidianmd/obsidian-releases)
6. Add this entry to the end of `community-plugins.json`:
   ```json
   {
     "id": "tasknotes-project-colors",
     "name": "TaskNotes Project Colors",
     "author": "minorchange",
     "description": "Automatically colors TaskNotes task cards by project using a deterministic hash-based color scheme.",
     "repo": "minorchange/obsidian-tasknotes-project-colors"
   }
   ```
7. Open a PR and wait for the Obsidian team to review and merge
