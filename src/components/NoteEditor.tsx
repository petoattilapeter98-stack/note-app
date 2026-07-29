import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import type { Note } from '../types'

interface NoteEditorProps {
  note: Note
  onUpdate: (id: string, changes: { title: string; body: string }) => void
  onDelete: (id: string) => void
}

const AUTOSAVE_DELAY_MS = 300

export function NoteEditor({ note, onUpdate, onDelete }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [body, setBody] = useState(note.body)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingRef = useRef<{ title: string; body: string } | null>(null)

  // Resets the editor when a different note is selected, and flushes any
  // unsaved debounced edit for the previously selected note first.
  useEffect(() => {
    setTitle(note.title)
    setBody(note.body)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      if (pendingRef.current) {
        onUpdate(note.id, pendingRef.current)
        pendingRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.id])

  function scheduleUpdate(changes: { title: string; body: string }): void {
    pendingRef.current = changes
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null
      if (pendingRef.current) {
        onUpdate(note.id, pendingRef.current)
        pendingRef.current = null
      }
    }, AUTOSAVE_DELAY_MS)
  }

  function flush(): void {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (pendingRef.current) {
      onUpdate(note.id, pendingRef.current)
      pendingRef.current = null
    }
  }

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value
    setTitle(value)
    scheduleUpdate({ title: value, body })
  }

  function handleBodyChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    const value = event.target.value
    setBody(value)
    scheduleUpdate({ title, body: value })
  }

  function handleDelete(): void {
    if (window.confirm('Delete this note? This cannot be undone.')) {
      onDelete(note.id)
    }
  }

  return (
    <div className="note-editor">
      <div className="note-editor__toolbar">
        <button type="button" className="note-editor__delete" onClick={handleDelete}>
          Delete
        </button>
      </div>
      <input
        className="note-editor__title"
        type="text"
        placeholder="Untitled note"
        aria-label="Note title"
        value={title}
        onChange={handleTitleChange}
        onBlur={flush}
      />
      <textarea
        className="note-editor__body"
        placeholder="Start writing..."
        aria-label="Note body"
        value={body}
        onChange={handleBodyChange}
        onBlur={flush}
      />
    </div>
  )
}
