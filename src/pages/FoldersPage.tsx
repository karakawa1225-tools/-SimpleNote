import { ChevronLeft, ChevronRight, Folder } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { FOLDERS } from '@/data/sampleNotes'
import { useNotes } from '@/context/NotesContext'
import { cn } from '@/lib/cn'

export function FoldersPage({ compact }: { compact?: boolean }) {
  const { countByFolder } = useNotes()
  const navigate = useNavigate()

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
          フォルダ
        </h1>
      </header>

      <ul className="space-y-2">
        {FOLDERS.map((f) => (
          <li key={f.id}>
            <button
              type="button"
              onClick={() => navigate(`/folders/${f.id}`)}
              className="flex w-full items-center justify-between rounded-2xl border border-sn-line bg-white px-4 py-4 text-left transition hover:border-sn-blue/30 hover:shadow-sm"
            >
              <span className="inline-flex items-center gap-3 font-bold text-sn-navy">
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${f.color}18` }}
                >
                  <Folder className="h-5 w-5" style={{ color: f.color }} />
                </span>
                {f.name}
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-sn-muted">
                {countByFolder[f.id]}
                <ChevronRight className="h-4 w-4" />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
