# User data boundary

The current static site stores bookmarks, notes, highlights and preferences in browser-local storage. This data stays on that browser/device and is not synchronized or committed to GitHub. Bible text JSON is read-only public content. When accounts or cross-device synchronization are introduced, use a separate authenticated API and database; never put private user data in the public Bible JSON files.
