import { ChevronLeft, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NoteCard } from '@/components/NoteCard'
import { useNotes } from '@/context/NotesContext'
import { cn } from '@/lib/cn'

export function SearchPage({ compact }: { compact?: boolean }) {
  const { searchNotes } = useNotes()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const results = useMemo(() => searchNotes(query), [searchNotes, query])

  return (
    <div className={cn('px-4 pt-4', compact ? 'pt-8' : 'lg:px-8 lg:pt-8')}>
      <header className="mb-4 flex items-center gap-2">
        {compact && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg p-1 text-sn-navy"
            aria-label="戻る"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="font-display text-lg font-black text-sn-navy lg:text-2xl">
          検索
        </h1>
      </header>

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sn-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="NOTEを検索..."
          className="w-full rounded-xl border border-sn-line bg-white py-3 pl-10 pr-3 text-sm font-semibold outline-none focus:border-sn-blue"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {results.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onClick={() => navigate(`/notes/${note.id}`)}
          />
        ))}
        {results.length === 0 && (
          <p className="col-span-full text-center text-sm text-sn-muted">
            該当するNOTEがありません
          </p>
        )}
      </div>
    </div>
  )
}
