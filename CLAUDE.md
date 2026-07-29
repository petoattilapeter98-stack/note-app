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
  `updatedAt` (`src/types.ts`).
- **Autosave:** `NoteEditor` debounces edits (~300ms) into
  `useNotes().updateNote`, and flushes immediately on blur or when the
  selected note changes/unmounts, so tab close doesn't drop keystrokes.
- **Sorting:** `NoteList` derives sort order from `updatedAt` at render
  time; storage/hook state stays insertion-ordered.
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
