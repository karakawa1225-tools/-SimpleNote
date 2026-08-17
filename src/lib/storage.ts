import { SAMPLE_NOTES } from '@/data/sampleNotes'
import type { Note } from '@/types/note'

/** 端末内ストレージ（スマホの内部フォルダ相当） */
const STORAGE_KEY = 'simplenote.local.v1'

export type SaveNotesResult =
  | { ok: true }
  | { ok: false; error: string }

export function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      void saveNotes(SAMPLE_NOTES)
      return SAMPLE_NOTES
    }
    const parsed = JSON.parse(raw) as Note[]
    if (!Array.isArray(parsed) || parsed.length === 0) {
      void saveNotes(SAMPLE_NOTES)
      return SAMPLE_NOTES
    }
    return parsed
  } catch {
    return SAMPLE_NOTES
  }
}

export function saveNotes(notes: Note[]): SaveNotesResult {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    return { ok: true }
  } catch (err) {
    const isQuota =
      err instanceof DOMException &&
      (err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        err.code === 22 ||
        err.code === 1014)
    return {
      ok: false,
      error: isQuota
        ? '端末の保存容量を超えました。写真の枚数を減らすか、別のNOTEを削除してから再度お試しください。'
        : '保存に失敗しました。もう一度お試しください。',
    }
  }
}

export function createId(prefix = 'note'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}
