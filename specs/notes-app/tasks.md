# Tasks: Notes App (v1)

Implements: [design.md](./design.md) | [requirements.md](./requirements.md)

Work top to bottom; each task should end in a committable, working state.
Check off as completed.

- [ ] 1. Scaffold project: Vite + React + TypeScript template, install
      Vitest + React Testing Library, verify `npm run dev` and `npm test`
      both run on a placeholder.
- [ ] 2. Define `Note` type (`src/types.ts`).
- [ ] 3. `src/lib/storage.ts` — `loadNotes`/`saveNotes` + tests (round-trip,
      missing key, corrupt JSON).
- [ ] 4. `src/hooks/useNotes.ts` — create/update/delete/list, backed by
      storage.ts, + tests.
- [ ] 5. `EmptyState` component (no notes / no selection variants).
- [ ] 6. `NoteListItem` + `NoteList` components — sorted list, "New note"
      button, empty state wiring, + tests.
- [ ] 7. `NoteEditor` component — controlled inputs, debounced autosave,
      flush-on-blur/unmount, delete with confirm, + tests.
- [ ] 8. `App` — wire list + editor + selection state together.
- [ ] 9. Styling pass — two-pane layout, responsive down to mobile width
      (NFR3).
- [ ] 10. README update — document local-only storage caveat (NFR2), how to
      run dev/build/test.
- [ ] 11. Full pass against Acceptance Criteria in requirements.md; fix any
      gaps.

## Explicitly deferred (not v1)
- Tags/folders/search
- Markdown rendering
- IndexedDB migration
- Multi-device sync
