import { useNavigate } from 'react-router-dom'
import { NoteCard } from '@/components/NoteCard'
import { useNotes } from '@/context/NotesContext'
import { cn } from '@/lib/cn'

export function NotesPage({ compact }: { compact?: boolean }) {
  const { activeNotes } = useNotes()
  const navigate = useNavigate()

  return (
    <div className={cn('px-4 pt-4', compact ? 'pt-8' : 'lg:px-8 lg:pt-8')}>
      <h1 className="mb-4 font-display text-lg font-black text-sn-navy lg:text-2xl">
        All NOTE
      </h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {activeNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onClick={() => navigate(`/notes/${note.id}`)}
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
  const { notes, restoreNote } = useNotes()
  const trashed = notes.filter((n) => n.trashed)

  return (
    <div className={cn('px-4 pt-4', compact ? 'pt-8' : 'lg:px-8 lg:pt-8')}>
      <h1 className="mb-4 font-display text-lg font-black text-sn-navy lg:text-2xl">
        ゴミ箱
      </h1>
      <div className="space-y-2">
        {trashed.map((note) => (
          <div
            key={note.id}
            className="flex items-center justify-between rounded-xl border border-sn-line bg-white px-4 py-3"
          >
            <span className="font-semibold text-sn-navy">{note.title}</span>
            <button
              type="button"
              onClick={() => restoreNote(note.id)}
              className="text-xs font-bold text-sn-blue"
            >
              復元
            </button>
          </div>
        ))}
        {trashed.length === 0 && (
          <p className="text-sm text-sn-muted">ゴミ箱は空です</p>
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
