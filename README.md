# URL identity for a puzzle shortlist

Original MIT educational example by Leon Reed, with AI assistance. This is a small reference module and CLI self-test, not the Riddle List production application or a claim of a shipped import/export feature.

## The contract

Accept absolute HTTPS URLs without credentials. Trim surrounding whitespace. Let the standard URL parser normalize host casing and default ports. Ignore a fragment for this example only. Preserve path casing, trailing slashes, every query value, duplicate query parameters and their order. Two modes encoded in different query strings remain separate bookmarks. Keep the first original input, preserve order, and never mutate the input array. Invalid input fails visibly rather than disappearing.

## Run

Node.js, no packages or network:

```sh
node bookmark-identity.mjs
```

The CLI covers normalization, meaningful differences, rejected inputs, stable order and input preservation. The example does not fetch URLs and does not verify publisher identity or link safety. Fragment-based application routes need a different identity contract; this implementation deliberately does not serve that case. Do not apply it blindly to signed URLs, generic crawlers or authentication flows.

## Why this example exists

I operate [Riddle List](https://riddlelist.com/), a daily puzzle discovery directory. A saved starting point should not accidentally lose a mode query. The [Worldle alternatives collection](https://riddlelist.com/games-like/worldle/) is context for choosing games, not test data or a claim that their official URLs follow this example contract. All tests use example.com synthetic addresses; there is no game answer list or publisher dataset here.

## API

`bookmarkKey(value)` returns the explicitly contracted key or throws. `uniqueBookmarks(values)` returns the first original value for each key. `selfTest()` performs the CLI checks. See the source for every assertion.
