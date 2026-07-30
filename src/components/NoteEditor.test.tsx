import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Note } from '../types'
import { NoteEditor } from './NoteEditor'

function makeNote(overrides: Partial<Note> = {}): Note {
  return {
    id: '1',
    title: 'Title',
    body: 'Body',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('NoteEditor', () => {
  it('renders the note title and body', () => {
    render(<NoteEditor note={makeNote()} onUpdate={vi.fn()} onDelete={vi.fn()} onTogglePin={vi.fn()} />)
    expect(screen.getByLabelText('Note title')).toHaveValue('Title')
    expect(screen.getByLabelText('Note body')).toHaveValue('Body')
  })

  it('debounces updates while typing', () => {
    const onUpdate = vi.fn()
    render(<NoteEditor note={makeNote()} onUpdate={onUpdate} onDelete={vi.fn()} onTogglePin={vi.fn()} />)

    fireEvent.change(screen.getByLabelText('Note title'), { target: { value: 'New title' } })
    expect(onUpdate).not.toHaveBeenCalled()

    vi.advanceTimersByTime(299)
    expect(onUpdate).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(onUpdate).toHaveBeenCalledWith('1', { title: 'New title', body: 'Body' })
  })

  it('flushes immediately on blur without waiting for the debounce', () => {
    const onUpdate = vi.fn()
    render(<NoteEditor note={makeNote()} onUpdate={onUpdate} onDelete={vi.fn()} onTogglePin={vi.fn()} />)

    const titleInput = screen.getByLabelText('Note title')
    fireEvent.change(titleInput, { target: { value: 'New title' } })
    fireEvent.blur(titleInput)

    expect(onUpdate).toHaveBeenCalledWith('1', { title: 'New title', body: 'Body' })
  })

  it('flushes a pending edit when switching to a different note', () => {
    const onUpdate = vi.fn()
    const { rerender } = render(
      <NoteEditor note={makeNote({ id: '1' })} onUpdate={onUpdate} onDelete={vi.fn()} onTogglePin={vi.fn()} />,
    )

    fireEvent.change(screen.getByLabelText('Note title'), { target: { value: 'Unsaved edit' } })
    expect(onUpdate).not.toHaveBeenCalled()

    rerender(
      <NoteEditor
        note={makeNote({ id: '2', title: 'Other note' })}
        onUpdate={onUpdate}
        onDelete={vi.fn()}
        onTogglePin={vi.fn()}
      />,
    )

    expect(onUpdate).toHaveBeenCalledWith('1', { title: 'Unsaved edit', body: 'Body' })
    expect(screen.getByLabelText('Note title')).toHaveValue('Other note')
  })

  it('deletes only after confirmation', () => {
    const onDelete = vi.fn()
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<NoteEditor note={makeNote()} onUpdate={vi.fn()} onDelete={onDelete} onTogglePin={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onDelete).not.toHaveBeenCalled()

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('offers to pin an unpinned note', () => {
    const onTogglePin = vi.fn()
    render(
      <NoteEditor
        note={makeNote({ pinned: false })}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        onTogglePin={onTogglePin}
      />,
    )

    const pinButton = screen.getByRole('button', { name: 'Pin' })
    expect(pinButton).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(pinButton)
    expect(onTogglePin).toHaveBeenCalledWith('1')
  })

  it('offers to unpin a pinned note', () => {
    const onTogglePin = vi.fn()
    render(
      <NoteEditor
        note={makeNote({ pinned: true })}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        onTogglePin={onTogglePin}
      />,
    )

    const unpinButton = screen.getByRole('button', { name: 'Unpin' })
    expect(unpinButton).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(unpinButton)
    expect(onTogglePin).toHaveBeenCalledWith('1')
  })

  it('does not require confirmation to pin', () => {
    const confirmSpy = vi.spyOn(window, 'confirm')
    render(
      <NoteEditor
        note={makeNote()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        onTogglePin={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Pin' }))
    expect(confirmSpy).not.toHaveBeenCalled()
  })
})
