import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { loadNotes } from '../lib/storage'
import { useNotes } from './useNotes'

beforeEach(() => {
  window.localStorage.clear()
})

describe('useNotes', () => {
  it('starts empty when nothing is stored', () => {
    const { result } = renderHook(() => useNotes())
    expect(result.current.notes).toEqual([])
  })

  it('loads previously persisted notes on mount', () => {
    const { result: seed } = renderHook(() => useNotes())
    act(() => {
      seed.current.createNote()
    })

    const { result } = renderHook(() => useNotes())
    expect(result.current.notes).toHaveLength(1)
  })

  it('creates a note with empty title/body and timestamps', () => {
    const { result } = renderHook(() => useNotes())

    let created!: ReturnType<typeof result.current.createNote>
    act(() => {
      created = result.current.createNote()
    })

    expect(result.current.notes).toHaveLength(1)
    expect(created.title).toBe('')
    expect(created.body).toBe('')
    expect(created.createdAt).toBe(created.updatedAt)
  })

  it('updates a note and bumps updatedAt', async () => {
    const { result } = renderHook(() => useNotes())

    let created!: ReturnType<typeof result.current.createNote>
    act(() => {
      created = result.current.createNote()
    })

    await new Promise((resolve) => setTimeout(resolve, 5))

    act(() => {
      result.current.updateNote(created.id, { title: 'Hello' })
    })

    const updated = result.current.notes[0]
    expect(updated.title).toBe('Hello')
    expect(updated.updatedAt).not.toBe(created.updatedAt)
  })

  it('deletes a note', () => {
    const { result } = renderHook(() => useNotes())

    let created!: ReturnType<typeof result.current.createNote>
    act(() => {
      created = result.current.createNote()
    })

    act(() => {
      result.current.deleteNote(created.id)
    })

    expect(result.current.notes).toEqual([])
  })

  it('persists changes to storage', () => {
    const { result } = renderHook(() => useNotes())

    act(() => {
      result.current.createNote()
    })

    expect(loadNotes()).toHaveLength(1)
  })

  describe('togglePin', () => {
    it('pins an unpinned note and unpins it again', () => {
      const { result } = renderHook(() => useNotes())

      let created!: ReturnType<typeof result.current.createNote>
      act(() => {
        created = result.current.createNote()
      })
      expect(result.current.notes[0].pinned).toBeFalsy()

      act(() => {
        result.current.togglePin(created.id)
      })
      expect(result.current.notes[0].pinned).toBe(true)

      act(() => {
        result.current.togglePin(created.id)
      })
      expect(result.current.notes[0].pinned).toBe(false)
    })

    it('does not change updatedAt', async () => {
      const { result } = renderHook(() => useNotes())

      let created!: ReturnType<typeof result.current.createNote>
      act(() => {
        created = result.current.createNote()
      })

      await new Promise((resolve) => setTimeout(resolve, 5))

      act(() => {
        result.current.togglePin(created.id)
      })

      expect(result.current.notes[0].updatedAt).toBe(created.updatedAt)
    })

    it('persists the pinned state', () => {
      const { result } = renderHook(() => useNotes())

      let created!: ReturnType<typeof result.current.createNote>
      act(() => {
        created = result.current.createNote()
      })
      act(() => {
        result.current.togglePin(created.id)
      })

      expect(loadNotes()[0].pinned).toBe(true)

      const { result: reloaded } = renderHook(() => useNotes())
      expect(reloaded.current.notes[0].pinned).toBe(true)
    })

    it('leaves other notes untouched', () => {
      const { result } = renderHook(() => useNotes())

      let first!: ReturnType<typeof result.current.createNote>
      act(() => {
        first = result.current.createNote()
      })
      act(() => {
        result.current.createNote()
      })

      act(() => {
        result.current.togglePin(first.id)
      })

      const other = result.current.notes.find((note) => note.id !== first.id)!
      expect(other.pinned).toBeFalsy()
    })
  })
})
