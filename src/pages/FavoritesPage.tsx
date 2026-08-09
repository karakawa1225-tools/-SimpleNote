import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NoteCard } from '@/components/NoteCard'
import { useNotes } from '@/context/NotesContext'
import { formatDateTime } from '@/lib/date'
import { cn } from '@/lib/cn'

export function NotesPage({ compact }: { compact?: boolean }) {
  const { activeNotes, trashNote } = useNotes()
  const navigate = useNavigate()

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`「${title}」をゴミ箱へ移動しますか？`)) return
    trashNote(id)
  }

  return (
    <div className={cn('px-4 pt-4', compact ? 'pt-8' : 'lg:px-8 lg:pt-8')}>
      <h1 className="mb-4 font-display text-lg font-black text-sn-navy lg:text-2xl">
        All NOTE
      </h1>
      <div className="flex flex-col gap-3">
        {activeNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            showActions
            onClick={() => navigate(`/notes/${note.id}`)}
            onEdit={() => navigate(`/notes/${note.id}`)}
            onDelete={() => handleDelete(note.id, note.title)}
          />
        ))}
      </div>
    </div>
  )
}

export function FavoritesPage({ compact }: { compact?: boolean }) {
  const { activeNotes } = useNotes()
  const navigate = useNavigate()
  const favorites = activeNotes.filter((n) => n.favorite)

  return (
    <div className={cn('px-4 pt-4', compact ? 'pt-8' : 'lg:px-8 lg:pt-8')}>
      <h1 className="mb-4 font-display text-lg font-black text-sn-navy lg:text-2xl">
        お気に入り
      </h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {favorites.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onClick={() => navigate(`/notes/${note.id}`)}
          />
        ))}
        {favorites.length === 0 && (
          <p className="text-sm text-sn-muted">お気に入りのNOTEはありません</p>
        )}
      </div>
    </div>
  )
}

export function TrashPage({ compact }: { compact?: boolean }) {
  const {
    notes,
    restoreNote,
    restoreNotes,
    deleteNotesPermanently,
    emptyTrash,
  } = useNotes()
  const trashed = useMemo(() => notes.filter((n) => n.trashed), [notes])
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    const valid = new Set(trashed.map((n) => n.id))
    setSelected((prev) => {
      const next = new Set([...prev].filter((id) => valid.has(id)))
      if (next.size === prev.size && [...next].every((id) => prev.has(id))) {
        return prev
      }
      return next
    })
  }, [trashed])

  const allSelected =
    trashed.length > 0 && trashed.every((n) => selected.has(n.id))
  const selectedCount = selected.size

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(trashed.map((n) => n.id)))
  }

  const handleDeleteSelected = () => {
    if (selectedCount === 0) return
    if (
      !window.confirm(
        `選択した${selectedCount}件を完全に削除しますか？この操作は取り消せません。`,
      )
    ) {
      return
    }
    deleteNotesPermanently([...selected])
    setSelected(new Set())
  }

  const handleEmptyTrash = () => {
    if (trashed.length === 0) return
    if (
      !window.confirm(
        `ゴミ箱の${trashed.length}件をすべて完全に削除しますか？この操作は取り消せません。`,
      )
    ) {
      return
    }
    emptyTrash()
    setSelected(new Set())
  }

  const handleRestoreSelected = () => {
    if (selectedCount === 0) return
    restoreNotes([...selected])
    setSelected(new Set())
  }

  return (
    <div className={cn('px-4 pt-4', compact ? 'pt-8' : 'lg:px-8 lg:pt-8')}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-lg font-black text-sn-navy lg:text-2xl">
            ゴミ箱
          </h1>
          <p className="mt-1 text-xs font-semibold text-sn-muted">
            {trashed.length}件
            {selectedCount > 0 ? ` ／ ${selectedCount}件選択中` : ''}
          </p>
        </div>
        {trashed.length > 0 && (
          <button
            type="button"
            onClick={handleEmptyTrash}
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
          >
            すべて完全削除
          </button>
        )}
      </div>

      {trashed.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl border border-sn-line bg-white p-3">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-sn-navy">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="h-4 w-4 accent-sn-blue"
            />
            すべて選択
          </label>
          <div className="ml-auto flex flex-wrap gap-2">
            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={handleRestoreSelected}
              className="rounded-lg border border-sn-line bg-white px-3 py-1.5 text-xs font-bold text-sn-blue disabled:cursor-not-allowed disabled:opacity-40"
            >
              選択を復元
            </button>
            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={handleDeleteSelected}
              className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              選択を完全削除
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {trashed.map((note) => {
          const checked = selected.has(note.id)
          return (
            <div
              key={note.id}
              className={cn(
                'flex items-center gap-3 rounded-xl border bg-white px-3 py-3 transition',
                checked ? 'border-sn-blue bg-sn-blue-soft/40' : 'border-sn-line',
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleOne(note.id)}
                className="h-4 w-4 shrink-0 accent-sn-blue"
                aria-label={`${note.title}を選択`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-sn-navy">{note.title}</p>
                <p className="text-[11px] text-sn-muted">
                  {formatDateTime(note.updatedAt)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => restoreNote(note.id)}
                  className="text-xs font-bold text-sn-blue"
                >
                  復元
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      !window.confirm(
                        `「${note.title}」を完全に削除しますか？この操作は取り消せません。`,
                      )
                    ) {
                      return
                    }
                    deleteNotesPermanently([note.id])
                  }}
                  className="text-xs font-bold text-red-600"
                >
                  削除
                </button>
              </div>
            </div>
          )
        })}
        {trashed.length === 0 && (
          <p className="rounded-2xl border border-dashed border-sn-line bg-white p-8 text-center text-sm text-sn-muted">
            ゴミ箱は空です
          </p>
        )}
      </div>
    </div>
  )
}

export function SettingsPage({ compact }: { compact?: boolean }) {
  return (
    <div className={cn('px-4 pt-4', compact ? 'pt-8' : 'lg:px-8 lg:pt-8')}>
      <h1 className="mb-4 font-display text-lg font-black text-sn-navy lg:text-2xl">
        設定
      </h1>
      <div className="space-y-3 rounded-2xl border border-sn-line bg-white p-4 text-sm">
        <p className="font-bold text-sn-navy">データ保存</p>
        <p className="leading-6 text-sn-muted">
          NOTEは端末内のローカルストレージ（スマホの内部フォルダ相当）に保存されます。
          ブラウザを閉じてもデータは残ります。
        </p>
        <p className="pt-2 font-bold text-sn-navy">バージョン</p>
        <p className="text-sn-muted">SimpleNote 1.0.0</p>
      </div>
    </div>
  )
}
