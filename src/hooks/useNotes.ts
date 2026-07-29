import { useEffect, useState } from 'react'
import { loadNotes, saveNotes } from '../lib/storage'
import type { Note } from '../types'

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => loadNotes())

  useEffect(() => {
    saveNotes(notes)
  }, [notes])

  function createNote(): Note {
    const now = new Date().toISOString()
    const note: Note = {
      id: crypto.randomUUID(),
      title: '',
      body: '',
      createdAt: now,
      updatedAt: now,
    }
    setNotes((prev) => [...prev, note])
    return note
  }

  function updateNote(id: string, changes: Partial<Pick<Note, 'title' | 'body'>>): void {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, ...changes, updatedAt: new Date().toISOString() }
          : note,
      ),
    )
  }

  function deleteNote(id: string): void {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }

  return { notes, createNote, updateNote, deleteNote }
}
