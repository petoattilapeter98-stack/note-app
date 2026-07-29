import type { Note } from '../types'
import { EmptyState } from './EmptyState'
import { NoteListItem } from './NoteListItem'

interface NoteListProps {
  notes: Note[]
  selectedNoteId: string | null
  onSelect: (id: string) => void
  onCreate: () => void
}

export function NoteList({ notes, selectedNoteId, onSelect, onCreate }: NoteListProps) {
  const sorted = [...notes].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  return (
    <div className="note-list">
      <div className="note-list__header">
        <h1 className="note-list__heading">Notes</h1>
        <button type="button" className="note-list__new-button" onClick={onCreate}>
          New note
        </button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          title="No notes yet"
          description="Create your first note to get started."
          action={{ label: 'New note', onClick: onCreate }}
        />
      ) : (
        <ul className="note-list__items">
          {sorted.map((note) => (
            <NoteListItem
              key={note.id}
              note={note}
              selected={note.id === selectedNoteId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
