import type { Note } from '../types'

const KEY = 'notes-app:notes'

export function loadNotes(): Note[] {
  const raw = window.localStorage.getItem(KEY)
  if (!raw) return []

  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Note[]) : []
  } catch {
    return []
  }
}

export function saveNotes(notes: Note[]): void {
  window.localStorage.setItem(KEY, JSON.stringify(notes))
}
