# note-app

A local-only notes web app: create, edit, and delete plain-text notes.
No account, no backend — everything is stored in your browser.

Built via spec-driven development; see [specs/notes-app](specs/notes-app)
for the requirements, design, and task breakdown this app was built from.

## Storage caveat

Notes are stored in this browser's `localStorage`, scoped to this browser
on this device:

- Clearing your browser's site data deletes all notes permanently.
- Notes do **not** sync across browsers or devices.
- Using a private/incognito window means notes disappear when it closes.

## Development

```bash
npm install
npm run dev      # start the dev server
npm test         # run the test suite
npm run build    # type-check and build for production
npm run lint     # lint the codebase
```
