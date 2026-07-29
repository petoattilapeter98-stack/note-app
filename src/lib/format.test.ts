import { describe, expect, it } from 'vitest'
import { formatRelativeTime } from './format'

const now = new Date('2026-01-10T12:00:00.000Z')

describe('formatRelativeTime', () => {
  it('says "just now" for very recent timestamps', () => {
    expect(formatRelativeTime('2026-01-10T11:59:58.000Z', now)).toBe('just now')
  })

  it('formats seconds ago', () => {
    expect(formatRelativeTime('2026-01-10T11:59:30.000Z', now)).toBe('30s ago')
  })

  it('formats minutes ago', () => {
    expect(formatRelativeTime('2026-01-10T11:45:00.000Z', now)).toBe('15m ago')
  })

  it('formats hours ago', () => {
    expect(formatRelativeTime('2026-01-10T09:00:00.000Z', now)).toBe('3h ago')
  })

  it('formats days ago', () => {
    expect(formatRelativeTime('2026-01-08T12:00:00.000Z', now)).toBe('2d ago')
  })

  it('falls back to a locale date beyond a week', () => {
    const result = formatRelativeTime('2025-12-01T12:00:00.000Z', now)
    expect(result).toBe(new Date('2025-12-01T12:00:00.000Z').toLocaleDateString())
  })
})
