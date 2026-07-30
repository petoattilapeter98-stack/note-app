import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Note } from '../types'
import { NoteList } from './NoteList'

function makeNote(overrides: Partial<Note> = {}): Note {
  return {
    id: '1',
    title: 'My note',
    body: 'body',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('NoteList', () => {
  it('shows an empty state with a create action when there are no notes', async () => {
    const onCreate = vi.fn()
    render(<NoteList notes={[]} selectedNoteId={null} onSelect={vi.fn()} onCreate={onCreate} />)

    expect(screen.getByText('No notes yet')).toBeInTheDocument()

    const [, emptyStateButton] = screen.getAllByRole('button', { name: 'New note' })
    await userEvent.click(emptyStateButton)
    expect(onCreate).toHaveBeenCalledTimes(1)
  })

  it('lists notes sorted by most recently updated first', () => {
    const older = makeNote({ id: '1', title: 'Older', updatedAt: '2026-01-01T00:00:00.000Z' })
    const newer = makeNote({ id: '2', title: 'Newer', updatedAt: '2026-01-02T00:00:00.000Z' })

    render(
      <NoteList notes={[older, newer]} selectedNoteId={null} onSelect={vi.fn()} onCreate={vi.fn()} />,
    )

    const items = screen.getAllByRole('button', { name: /Older|Newer/ })
    expect(items[0]).toHaveTextContent('Newer')
    expect(items[1]).toHaveTextContent('Older')
  })

  it('shows "Untitled note" for notes without a title', () => {
    render(
      <NoteList
        notes={[makeNote({ title: '' })]}
        selectedNoteId={null}
        onSelect={vi.fn()}
        onCreate={vi.fn()}
      />,
    )

    expect(screen.getByText('Untitled note')).toBeInTheDocument()
  })

  it('sorts pinned notes above unpinned ones regardless of update time', () => {
    const recentUnpinned = makeNote({
      id: '1',
      title: 'Recent',
      updatedAt: '2026-01-05T00:00:00.000Z',
    })
    const stalePinned = makeNote({
      id: '2',
      title: 'Stale pinned',
      updatedAt: '2026-01-01T00:00:00.000Z',
      pinned: true,
    })

    render(
      <NoteList
        notes={[recentUnpinned, stalePinned]}
        selectedNoteId={null}
        onSelect={vi.fn()}
        onCreate={vi.fn()}
      />,
    )

    const items = screen.getAllByRole('button', { name: /Recent|Stale pinned/ })
    expect(items[0]).toHaveTextContent('Stale pinned')
    expect(items[1]).toHaveTextContent('Recent')
  })

  it('sorts by updatedAt within the pinned group', () => {
    const olderPinned = makeNote({
      id: '1',
      title: 'Older pinned',
      updatedAt: '2026-01-01T00:00:00.000Z',
      pinned: true,
    })
    const newerPinned = makeNote({
      id: '2',
      title: 'Newer pinned',
      updatedAt: '2026-01-02T00:00:00.000Z',
      pinned: true,
    })

    render(
      <NoteList
        notes={[olderPinned, newerPinned]}
        selectedNoteId={null}
        onSelect={vi.fn()}
        onCreate={vi.fn()}
      />,
    )

    const items = screen.getAllByRole('button', { name: /pinned/ })
    expect(items[0]).toHaveTextContent('Newer pinned')
    expect(items[1]).toHaveTextContent('Older pinned')
  })

  it('marks pinned notes with an indicator and leaves unpinned ones unmarked', () => {
    const { rerender } = render(
      <NoteList
        notes={[makeNote({ pinned: true })]}
        selectedNoteId={null}
        onSelect={vi.fn()}
        onCreate={vi.fn()}
      />,
    )
    expect(screen.getByRole('img', { name: 'Pinned' })).toBeInTheDocument()

    rerender(
      <NoteList
        notes={[makeNote({ pinned: false })]}
        selectedNoteId={null}
        onSelect={vi.fn()}
        onCreate={vi.fn()}
      />,
    )
    expect(screen.queryByRole('img', { name: 'Pinned' })).not.toBeInTheDocument()
  })

  it('treats a note with no pinned field as unpinned', () => {
    // Notes saved before the pin feature existed have no `pinned` key at all.
    const legacyNote = makeNote({ id: '1', title: 'Legacy', updatedAt: '2026-01-05T00:00:00.000Z' })
    delete (legacyNote as { pinned?: boolean }).pinned
    const pinned = makeNote({
      id: '2',
      title: 'Pinned',
      updatedAt: '2026-01-01T00:00:00.000Z',
      pinned: true,
    })

    render(
      <NoteList
        notes={[legacyNote, pinned]}
        selectedNoteId={null}
        onSelect={vi.fn()}
        onCreate={vi.fn()}
      />,
    )

    const items = screen.getAllByRole('button', { name: /Legacy|Pinned/ })
    expect(items[0]).toHaveTextContent('Pinned')
    expect(items[1]).toHaveTextContent('Legacy')
    expect(screen.getAllByRole('img', { name: 'Pinned' })).toHaveLength(1)
  })

  it('calls onSelect when a note is clicked', async () => {
    const onSelect = vi.fn()
    render(
      <NoteList notes={[makeNote()]} selectedNoteId={null} onSelect={onSelect} onCreate={vi.fn()} />,
    )

    await userEvent.click(screen.getByRole('button', { name: /My note/ }))
    expect(onSelect).toHaveBeenCalledWith('1')
  })
})
