# Tasks: Notes App (v1)

Implements: [design.md](./design.md) | [requirements.md](./requirements.md)

Work top to bottom; each task should end in a committable, working state.
Check off as completed.

- [x] 1. Scaffold project: Vite + React + TypeScript template, install
      Vitest + React Testing Library, verify `npm run dev` and `npm test`
      both run on a placeholder.
- [x] 2. Define `Note` type (`src/types.ts`).
- [x] 3. `src/lib/storage.ts` — `loadNotes`/`saveNotes` + tests (round-trip,
      missing key, corrupt JSON).
- [x] 4. `src/hooks/useNotes.ts` — create/update/delete/list, backed by
      storage.ts, + tests.
- [x] 5. `EmptyState` component (no notes / no selection variants).
- [x] 6. `NoteListItem` + `NoteList` components — sorted list, "New note"
      button, empty state wiring, + tests.
- [x] 7. `NoteEditor` component — controlled inputs, debounced autosave,
      flush-on-blur/unmount, delete with confirm, + tests.
- [x] 8. `App` — wire list + editor + selection state together.
- [x] 9. Styling pass — two-pane layout, responsive down to mobile width
      (NFR3).
- [x] 10. README update — document local-only storage caveat (NFR2), how to
      run dev/build/test.
- [x] 11. Full pass against Acceptance Criteria in requirements.md; fix any
      gaps.

## Explicitly deferred (not v1)
- Tags/folders/search
- Markdown rendering
- IndexedDB migration
- Multi-device sync
