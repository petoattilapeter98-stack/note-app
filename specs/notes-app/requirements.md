# Requirements: Notes App (v1)

## Overview
A local-only, single-user web application for creating, editing, deleting,
and browsing plain-text notes. No backend, no accounts — all data lives in
the user's browser.

## Out of scope (v1)
- User accounts / authentication
- Syncing across devices or browsers
- Tags, folders, search
- Markdown rendering / rich text
- Sharing or export

These may become future iterations but are explicitly excluded from this spec.

## Functional Requirements

### FR1 — Create a note
- WHEN the user clicks "New note", THE SYSTEM SHALL create a new empty note
  with a title and body, and open it for editing.
- THE SYSTEM SHALL assign each note a unique ID and a created timestamp.

### FR2 — Edit a note
- WHEN the user modifies a note's title or body, THE SYSTEM SHALL persist the
  change automatically (no explicit "save" step required).
- THE SYSTEM SHALL update the note's "last modified" timestamp on every edit.
- Edits SHALL be debounced/saved without noticeable data loss on tab close.

### FR3 — List notes
- THE SYSTEM SHALL display all notes in a list/sidebar, showing at minimum
  title and last-modified date.
- THE SYSTEM SHALL order notes by last-modified date, most recent first.
- IF a note has no title, THEN THE SYSTEM SHALL display a placeholder
  (e.g. "Untitled note") in the list.

### FR4 — View/select a note
- WHEN the user selects a note from the list, THE SYSTEM SHALL display its
  full title and body in an editable view.

### FR5 — Delete a note
- WHEN the user requests to delete a note, THE SYSTEM SHALL ask for
  confirmation before removing it.
- WHEN deletion is confirmed, THE SYSTEM SHALL permanently remove the note
  from storage and update the list.

### FR6 — Empty state
- IF there are no notes, THEN THE SYSTEM SHALL show an empty state with a
  prompt to create the first note.

### FR7 — Persistence
- THE SYSTEM SHALL persist all notes in the browser's localStorage.
- WHEN the app is reloaded, THE SYSTEM SHALL restore all previously saved
  notes.

## Non-Functional Requirements

### NFR1 — No backend
- THE SYSTEM SHALL run entirely client-side; no network requests are
  required for core functionality.

### NFR2 — Data durability caveats
- THE SYSTEM SHALL clearly be understood (documented in README) as
  single-browser storage: clearing browser data deletes all notes, and notes
  do not sync across browsers/devices.

### NFR3 — Responsiveness
- THE SYSTEM SHALL be usable on both desktop and mobile-width viewports.

### NFR4 — Performance
- THE SYSTEM SHALL remain responsive with at least 500 notes.

## Acceptance Criteria (v1 "done")
1. User can create, edit, list, select, and delete notes.
2. Notes survive a full page reload.
3. Deleting a note requires confirmation and cannot be undone accidentally.
4. Empty state is shown when there are zero notes.
5. App has automated tests covering the above behaviors.
