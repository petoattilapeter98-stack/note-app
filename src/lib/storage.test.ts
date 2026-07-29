import { beforeEach, describe, expect, it } from 'vitest'
import type { Note } from '../types'
import { loadNotes, saveNotes } from './storage'

const note: Note = {
  id: '1',
  title: 'Title',
  body: 'Body',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('storage', () => {
  it('returns an empty array when nothing has been saved', () => {
    expect(loadNotes()).toEqual([])
  })

  it('round-trips notes through save and load', () => {
    saveNotes([note])
    expect(loadNotes()).toEqual([note])
  })

  it('returns an empty array for corrupt JSON', () => {
    window.localStorage.setItem('notes-app:notes', '{not valid json')
    expect(loadNotes()).toEqual([])
  })

  it('returns an empty array when stored value is not an array', () => {
    window.localStorage.setItem('notes-app:notes', JSON.stringify({ foo: 'bar' }))
    expect(loadNotes()).toEqual([])
  })
})
