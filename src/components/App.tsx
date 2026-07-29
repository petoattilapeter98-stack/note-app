import { useState } from 'react'
import { useNotes } from '../hooks/useNotes'
import { EmptyState } from './EmptyState'
import { NoteEditor } from './NoteEditor'
import { NoteList } from './NoteList'

export function App() {
  const { notes, createNote, updateNote, deleteNote } = useNotes()
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)

  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? null

  function handleCreate(): void {
    const note = createNote()
    setSelectedNoteId(note.id)
  }

  function handleDelete(id: string): void {
    deleteNote(id)
    setSelectedNoteId((current) => (current === id ? null : current))
  }

  return (
    <div className="app">
      <NoteList
        notes={notes}
        selectedNoteId={selectedNoteId}
        onSelect={setSelectedNoteId}
        onCreate={handleCreate}
      />
      <main className="app__editor-pane">
        {selectedNote ? (
          <NoteEditor note={selectedNote} onUpdate={updateNote} onDelete={handleDelete} />
        ) : (
          <EmptyState
            title="No note selected"
            description="Select a note from the list, or create a new one."
          />
        )}
      </main>
    </div>
  )
}
