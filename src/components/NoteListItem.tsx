import { formatRelativeTime } from '../lib/format'
import type { Note } from '../types'

interface NoteListItemProps {
  note: Note
  selected: boolean
  onSelect: (id: string) => void
}

export function NoteListItem({ note, selected, onSelect }: NoteListItemProps) {
  return (
    <li>
      <button
        type="button"
        className={`note-list-item${selected ? ' note-list-item--selected' : ''}`}
        aria-current={selected}
        onClick={() => onSelect(note.id)}
      >
        <span className="note-list-item__title">{note.title.trim() || 'Untitled note'}</span>
        <span className="note-list-item__timestamp">{formatRelativeTime(note.updatedAt)}</span>
      </button>
    </li>
  )
}
