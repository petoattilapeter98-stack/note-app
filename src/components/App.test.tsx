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

  it('pins a note, moves it to the top, and keeps it pinned across reload', async () => {
    const user = userEvent.setup()

    const { unmount } = render(<App />)
    const [newNoteButton] = screen.getAllByRole('button', { name: 'New note' })

    // First note, then a second (newer) one that would normally sort above it.
    await user.click(newNoteButton)
    const firstTitle = screen.getByLabelText('Note title')
    await user.type(firstTitle, 'Older note')
    fireEvent.blur(firstTitle)

    await user.click(newNoteButton)
    const secondTitle = screen.getByLabelText('Note title')
    await user.type(secondTitle, 'Newer note')
    fireEvent.blur(secondTitle)

    const listedTitles = () =>
      screen.getAllByRole('button', { name: /Older note|Newer note/ }).map((el) => el.textContent)

    expect(listedTitles()[0]).toContain('Newer note')

    // Pin the older note; it should jump above the newer, unpinned one.
    await user.click(screen.getByRole('button', { name: /Older note/ }))
    await user.click(screen.getByRole('button', { name: 'Pin' }))

    expect(listedTitles()[0]).toContain('Older note')
    expect(screen.getByRole('button', { name: 'Unpin' })).toBeInTheDocument()

    const stored = loadNotes()
    expect(stored.find((note) => note.title === 'Older note')?.pinned).toBe(true)
    expect(stored.find((note) => note.title === 'Newer note')?.pinned).toBeFalsy()

    unmount()
    render(<App />)
    expect(listedTitles()[0]).toContain('Older note')
    expect(screen.getByRole('img', { name: 'Pinned' })).toBeInTheDocument()
  })

  it('unpins a pinned note and restores normal ordering', async () => {
    const user = userEvent.setup()
    render(<App />)
    const [newNoteButton] = screen.getAllByRole('button', { name: 'New note' })

    await user.click(newNoteButton)
    const title = screen.getByLabelText('Note title')
    await user.type(title, 'Pinnable')
    fireEvent.blur(title)

    await user.click(screen.getByRole('button', { name: 'Pin' }))
    expect(screen.getByRole('img', { name: 'Pinned' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Unpin' }))
    expect(screen.queryByRole('img', { name: 'Pinned' })).not.toBeInTheDocument()
    expect(loadNotes()[0].pinned).toBe(false)
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
