import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createId, loadNotes, saveNotes } from '@/lib/storage'
import type { FolderId, Note } from '@/types/note'
import { MAX_ATTACHMENTS } from '@/lib/attachments'

interface NotesContextValue {
  notes: Note[]
  activeNotes: Note[]
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

  useEffect(() => {
    saveNotes(notes)
  }, [notes])

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
    setNotes((prev) => prev.filter((n) => !idSet.has(n.id)))
  }, [])

  const emptyTrash = useCallback(() => {
    setNotes((prev) => prev.filter((n) => !n.trashed))
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
