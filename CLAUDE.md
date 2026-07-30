# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

The app is scaffolded and implemented per `specs/notes-app/tasks.md`. Before
making further changes, read the spec in `specs/notes-app/`:

- [`specs/notes-app/requirements.md`](specs/notes-app/requirements.md) —
  functional/non-functional requirements and acceptance criteria (EARS-style
  "WHEN / THE SYSTEM SHALL" phrasing).
- [`specs/notes-app/design.md`](specs/notes-app/design.md) — architecture,
  data model, component breakdown, testing strategy.
- [`specs/notes-app/tasks.md`](specs/notes-app/tasks.md) — the ordered
  implementation checklist. Work through it top to bottom; each task should
  land in a committable, working state. Update checkboxes as tasks complete.

This is spec-driven development: implementation must trace back to
requirements.md and follow design.md. If a requested change conflicts with
either doc, update the spec first, then implement — don't let code and spec
drift apart.

## Architecture (see design.md for full detail)

- **Stack:** Vite + React 19 + TypeScript, no backend.
- **Persistence:** browser `localStorage` only, isolated behind
  `src/lib/storage.ts` (the only module allowed to touch
  `window.localStorage` directly) — this is the seam for a future
  IndexedDB/backend swap.
- **State:** lifted to `App` (`src/components/App.tsx`), exposed via the
  `useNotes()` hook (`src/hooks/useNotes.ts`) — no external state library.
- **Data model:** a `Note` has `id`, `title`, `body`, `createdAt`,
  `updatedAt`, and optional `pinned` (`src/types.ts`). `pinned` is optional
  on purpose — notes stored before the field existed read as unpinned, so
  there is no migration step. Keep it that way.
- **Autosave:** `NoteEditor` debounces edits (~300ms) into
  `useNotes().updateNote`, and flushes immediately on blur or when the
  selected note changes/unmounts, so tab close doesn't drop keystrokes.
- **Sorting:** `NoteList` derives sort order at render time (pinned notes
  first, then `updatedAt` descending within each group); storage/hook state
  stays insertion-ordered.
- **Pinning:** `useNotes().togglePin` deliberately does not touch
  `updatedAt` — pinning is presentational, not an edit. The Pin/Unpin
  control lives in the `NoteEditor` toolbar rather than on the list row,
  because the row is itself a `<button>` and can't nest one.
- **Selection is not persisted** — `selectedNoteId` lives only in `App`'s
  React state, so it resets to `null` on reload (notes themselves persist).

## Commands

```bash
npm install
npm run dev      # start the dev server
npm test         # run the Vitest suite (unit + component tests)
npm run build    # type-check (tsc -b) and build for production
npm run lint     # oxlint
```

## Explicitly out of scope for v1

Tags/folders/search, markdown rendering, IndexedDB migration, multi-device
sync, accounts/auth. See requirements.md's "Out of scope" section before
adding any of these.
