# Design: Notes App (v1)

Implements: [requirements.md](./requirements.md)

## Stack
- **Build tool:** Vite
- **Language:** TypeScript
- **UI:** React 19
- **Persistence:** browser `localStorage`
- **Testing:** Vitest + React Testing Library
- **Styling:** plain CSS (CSS modules), no UI framework — v1 scope doesn't
  justify one

## Architecture

Single-page app, two-pane layout:

```
+------------------+---------------------------------+
|  Note list        |  Editor (title + body)          |
|  (sidebar)        |                                 |
|  - New note btn   |                                 |
|  - note items     |                                 |
+------------------+---------------------------------+
```

### Data model

```ts
interface Note {
  id: string;          // crypto.randomUUID()
  title: string;
  body: string;
  createdAt: string;   // ISO 8601
  updatedAt: string;   // ISO 8601
}
```

### Storage layer
`src/lib/storage.ts` — a thin wrapper around localStorage, isolated so it's
the only module that touches `window.localStorage` directly. This keeps
components testable (mock this module) and gives a single seam if IndexedDB
replaces localStorage later.

```ts
// storage.ts
const KEY = "notes-app:notes";
function loadNotes(): Note[]
function saveNotes(notes: Note[]): void
```

Notes are stored as a single JSON array under one key — simplest approach,
fine for the NFR4 target of 500 notes (small enough to serialize on every
change without perceptible lag).

### State management
React state lifted to `App`, no external state library — scope doesn't
justify Redux/Zustand. A custom hook `useNotes()` owns the notes array and
exposes `createNote`, `updateNote`, `deleteNote`, reading/writing through
`storage.ts` and keeping localStorage in sync via a `useEffect` on change.

### Components
- `App` — layout, owns `useNotes()`, tracks `selectedNoteId`
- `NoteList` — renders sorted note previews, "New note" button, empty state
- `NoteListItem` — single row: title, relative last-modified time
- `NoteEditor` — controlled title input + textarea, calls `updateNote` on
  change (debounced ~300ms to avoid excessive writes), delete button with a
  confirmation dialog (native `window.confirm` is sufficient for v1)
- `EmptyState` — shown in editor pane when no note is selected, and in list
  when there are zero notes

### Debounced autosave
Edits update local component state immediately (so typing feels instant)
and are pushed to `useNotes().updateNote` on a 300ms debounce, and flushed
immediately on blur / component unmount so a quick tab close doesn't lose
the last keystrokes (addresses FR2's data-loss requirement).

### Sorting
Notes list is derived (`[...notes].sort(...)` by `updatedAt` desc) rather
than stored sorted, so storage stays simple and sort order can't drift from
the source of truth.

### Deletion
`window.confirm("Delete this note? This cannot be undone.")` before calling
`deleteNote`. If the deleted note was selected, selection clears to `null`
(showing the empty state).

## File structure
```
note-app/
  src/
    lib/
      storage.ts
      storage.test.ts
    hooks/
      useNotes.ts
      useNotes.test.ts
    components/
      App.tsx
      NoteList.tsx
      NoteListItem.tsx
      NoteEditor.tsx
      EmptyState.tsx
    main.tsx
    types.ts
  index.html
  package.json
  tsconfig.json
  vite.config.ts
```

## Testing strategy
- `storage.ts`: unit tests for load/save round-trip, corrupt/missing data
  handling (falls back to empty array).
- `useNotes.ts`: unit tests for create/update/delete/sort behavior.
- Component tests: creating a note, editing persists, deleting asks for
  confirmation, empty states render.
- No e2e framework for v1 — component-level tests cover the acceptance
  criteria; can add Playwright later if the app grows.

## Open questions / assumptions
- Single localStorage key holding all notes (vs. one key per note) —
  simpler; revisit only if NFR4's 500-note target becomes a real bottleneck.
- No undo for deletion in v1 — confirmation dialog is the only safeguard,
  per requirements.
