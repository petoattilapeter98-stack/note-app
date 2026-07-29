import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadNotes } from '../lib/storage'
import { App } from './App'

beforeEach(() => {
  window.localStorage.clear()
  vi.spyOn(window, 'confirm').mockReturnValue(true)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('App', () => {
  it('shows an empty state when there are no notes', () => {
    render(<App />)
    expect(screen.getByText('No notes yet')).toBeInTheDocument()
    expect(screen.getByText('No note selected')).toBeInTheDocument()
  })

  it('creates a note, edits it, and persists the edit across reload', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)

    const [newNoteButton] = screen.getAllByRole('button', { name: 'New note' })
    await user.click(newNoteButton)

    const titleInput = screen.getByLabelText('Note title')
    await user.type(titleInput, 'Grocery list')
    fireEvent.blur(titleInput)

    expect(await screen.findByText('Grocery list')).toBeInTheDocument()
    expect(loadNotes()).toHaveLength(1)
    expect(loadNotes()[0].title).toBe('Grocery list')

    unmount()
    render(<App />)
    expect(screen.getByText('Grocery list')).toBeInTheDocument()
  })

  it('deletes a note after confirmation and clears the editor selection', async () => {
    const user = userEvent.setup()
    render(<App />)

    const [newNoteButton] = screen.getAllByRole('button', { name: 'New note' })
    await user.click(newNoteButton)

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(window.confirm).toHaveBeenCalled()
    expect(screen.getByText('No notes yet')).toBeInTheDocument()
    expect(screen.getByText('No note selected')).toBeInTheDocument()
    expect(loadNotes()).toHaveLength(0)
  })
})
