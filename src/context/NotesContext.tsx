import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createId, loadNotes, saveNotes } from '@/lib/storage'
import { blobToThumb, dataUrlToBlob } from '@/lib/imageCompress'
import { deleteFiles, getFile, putFile } from '@/lib/fileStore'
import type { Attachment, FolderId, Note } from '@/types/note'
import { MAX_ATTACHMENTS } from '@/lib/attachments'

/** localStorage 用。実ファイルは IndexedDB に残す */
function shrinkHeavyPreviews(notes: Note[]): Note[] {
  return notes.map((n) => ({
    ...n,
    attachments: n.attachments.map((a) => {
      if (
        typeof a.preview === 'string' &&
        a.preview.startsWith('data:') &&
        a.preview.length > 80_000
      ) {
        return { ...a, preview: '#94A3B8' }
      }
      return a
    }),
  }))
}

function attachmentIds(notes: Note[]): string[] {
  return notes.flatMap((n) => n.attachments.map((a) => a.id))
}

async function migratePreviewsToFiles(notes: Note[]): Promise<Note[] | null> {
  let changed = false
  const next: Note[] = []

  for (const note of notes) {
    const atts: Attachment[] = []
    for (const a of note.attachments) {
      if (!a.preview?.startsWith('data:')) {
        atts.push(a)
        continue
      }

      const existing = await getFile(a.id)
      if (!existing) {
        const blob = dataUrlToBlob(a.preview)
        await putFile({
          id: a.id,
          name: a.name,
          mime:
            blob.type ||
            (a.type === 'pdf' ? 'application/pdf' : 'image/jpeg'),
          blob,
        })
        changed = true
      }

      if (a.type === 'image' && a.preview.length > 40_000) {
        const blob = existing?.blob ?? dataUrlToBlob(a.preview)
        const thumb = await blobToThumb(blob)
        atts.push({ ...a, preview: thumb || '#94A3B8' })
        changed = true
      } else {
        atts.push(a)
      }
    }
    next.push({ ...note, attachments: atts })
  }

  return changed ? next : null
}

interface NotesContextValue {
  notes: Note[]
  activeNotes: Note[]
  saveError: string | null
  clearSaveError: () => void
  getNote: (id: string) => Note | undefined
  addNote: (input: {
    title: string
    body: string
    memo: string
    folderId: FolderId
    attachments?: Note['attachments']
    ruledLines?: boolean
    showDateTime?: boolean
    displayAt?: string | null
  }) => Note
  updateNote: (id: string, patch: Partial<Note>) => void
  toggleFavorite: (id: string) => void
  trashNote: (id: string) => void
  restoreNote: (id: string) => void
  restoreNotes: (ids: string[]) => void
  deleteNotesPermanently: (ids: string[]) => void
  emptyTrash: () => void
  notesOnDate: (dateKey: string) => Note[]
  notesInFolder: (folderId: FolderId) => Note[]
  searchNotes: (query: string) => Note[]
  countByFolder: Record<FolderId, number>
  dateCounts: Record<string, number>
}

const NotesContext = createContext<NotesContextValue | null>(null)

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(() => loadNotes())
  const [saveError, setSaveError] = useState<string | null>(null)
  const pendingSaveMessage = useRef<string | null>(null)
  const initialNotes = useRef(notes)

  useEffect(() => {
    const light = shrinkHeavyPreviews(notes)
    const result = saveNotes(light)
    if (result.ok) {
      if (pendingSaveMessage.current) {
        setSaveError(pendingSaveMessage.current)
        pendingSaveMessage.current = null
      } else {
        setSaveError(null)
      }
      return
    }

    const shrunk = shrinkHeavyPreviews(notes)
    const retry = saveNotes(shrunk)
    if (retry.ok) {
      pendingSaveMessage.current =
        '一覧はシンプル表示にしました。写真はタップすると実画像を開けます。'
      setSaveError(pendingSaveMessage.current)
      pendingSaveMessage.current = null
      return
    }
    setSaveError(result.error)
  }, [notes])

  const clearSaveError = useCallback(() => setSaveError(null), [])

  useEffect(() => {
    let cancelled = false
    void migratePreviewsToFiles(initialNotes.current).then((migrated) => {
      if (!cancelled && migrated) setNotes(migrated)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // iframe デモ間で同じローカルデータを共有
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== 'simplenote.local.v1' || !e.newValue) return
      try {
        const parsed = JSON.parse(e.newValue) as Note[]
        if (Array.isArray(parsed)) setNotes(parsed)
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const activeNotes = useMemo(
    () =>
      notes
        .filter((n) => !n.trashed)
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        ),
    [notes],
  )

  const getNote = useCallback(
    (id: string) => notes.find((n) => n.id === id),
    [notes],
  )

  const addNote = useCallback(
    (input: {
      title: string
      body: string
      memo: string
      folderId: FolderId
      attachments?: Note['attachments']
      ruledLines?: boolean
      showDateTime?: boolean
      displayAt?: string | null
    }) => {
      const now = new Date().toISOString()
      const showDateTime = input.showDateTime ?? true
      const note: Note = {
        id: createId('note'),
        title: input.title.trim() || '無題のNOTE',
        body: input.body,
        memo: input.memo,
        folderId: input.folderId,
        createdAt: input.displayAt ?? now,
        updatedAt: now,
        favorite: false,
        trashed: false,
        attachments: (input.attachments ?? []).slice(0, MAX_ATTACHMENTS),
        ruledLines: input.ruledLines ?? false,
        showDateTime,
        displayAt: showDateTime ? (input.displayAt ?? now) : null,
      }
      setNotes((prev) => [note, ...prev])
      return note
    },
    [],
  )

  const updateNote = useCallback((id: string, patch: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n
        const next = {
          ...n,
          ...patch,
          updatedAt: new Date().toISOString(),
        }
        if (patch.attachments) {
          next.attachments = patch.attachments.slice(0, MAX_ATTACHMENTS)
          const keep = new Set(next.attachments.map((a) => a.id))
          const removed = n.attachments
            .filter((a) => !keep.has(a.id))
            .map((a) => a.id)
          if (removed.length > 0) void deleteFiles(removed)
        }
        return next
      }),
    )
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, favorite: !n.favorite } : n)),
    )
  }, [])

  const trashNote = useCallback((id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, trashed: true } : n)),
    )
  }, [])

  const restoreNote = useCallback((id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, trashed: false } : n)),
    )
  }, [])

  const restoreNotes = useCallback((ids: string[]) => {
    const idSet = new Set(ids)
    setNotes((prev) =>
      prev.map((n) => (idSet.has(n.id) ? { ...n, trashed: false } : n)),
    )
  }, [])

  const deleteNotesPermanently = useCallback((ids: string[]) => {
    const idSet = new Set(ids)
    setNotes((prev) => {
      const removing = prev.filter((n) => idSet.has(n.id))
      void deleteFiles(attachmentIds(removing))
      return prev.filter((n) => !idSet.has(n.id))
    })
  }, [])

  const emptyTrash = useCallback(() => {
    setNotes((prev) => {
      const removing = prev.filter((n) => n.trashed)
      void deleteFiles(attachmentIds(removing))
      return prev.filter((n) => !n.trashed)
    })
  }, [])

  const notesOnDate = useCallback(
    (dateKey: string) =>
      activeNotes.filter((n) => n.createdAt.slice(0, 10) === dateKey),
    [activeNotes],
  )

  const notesInFolder = useCallback(
    (folderId: FolderId) => activeNotes.filter((n) => n.folderId === folderId),
    [activeNotes],
  )

  const searchNotes = useCallback(
    (query: string) => {
      const q = query.trim().toLowerCase()
      if (!q) return activeNotes
      return activeNotes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.body.toLowerCase().includes(q) ||
          n.memo.toLowerCase().includes(q),
      )
    },
    [activeNotes],
  )

  const countByFolder = useMemo(() => {
    const base: Record<FolderId, number> = {
      work: 0,
      private: 0,
      ideas: 0,
      materials: 0,
      other: 0,
    }
    for (const n of activeNotes) base[n.folderId] += 1
    return base
  }, [activeNotes])

  const dateCounts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const n of activeNotes) {
      const key = n.createdAt.slice(0, 10)
      map[key] = (map[key] ?? 0) + 1
    }
    return map
  }, [activeNotes])

  const value = useMemo(
    () => ({
      notes,
      activeNotes,
      saveError,
      clearSaveError,
      getNote,
      addNote,
      updateNote,
      toggleFavorite,
      trashNote,
      restoreNote,
      restoreNotes,
      deleteNotesPermanently,
      emptyTrash,
      notesOnDate,
      notesInFolder,
      searchNotes,
      countByFolder,
      dateCounts,
    }),
    [
      notes,
      activeNotes,
      saveError,
      clearSaveError,
      getNote,
      addNote,
      updateNote,
      toggleFavorite,
      trashNote,
      restoreNote,
      restoreNotes,
      deleteNotesPermanently,
      emptyTrash,
      notesOnDate,
      notesInFolder,
      searchNotes,
      countByFolder,
      dateCounts,
    ],
  )

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
}

export function useNotes() {
  const ctx = useContext(NotesContext)
  if (!ctx) throw new Error('useNotes must be used within NotesProvider')
  return ctx
}
