import { SAMPLE_NOTES } from '@/data/sampleNotes'
import type { Note } from '@/types/note'

/** 端末内ストレージ（スマホのローカルフォルダ相当） */
const STORAGE_KEY = 'simplenote.local.v1'

export function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      saveNotes(SAMPLE_NOTES)
      return SAMPLE_NOTES
    }
    const parsed = JSON.parse(raw) as Note[]
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveNotes(SAMPLE_NOTES)
      return SAMPLE_NOTES
    }
    return parsed
  } catch {
    return SAMPLE_NOTES
  }
}

export function saveNotes(notes: Note[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export function createId(prefix = 'note'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}
