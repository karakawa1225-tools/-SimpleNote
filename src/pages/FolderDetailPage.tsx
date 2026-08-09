import { ChevronLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { NoteCard } from '@/components/NoteCard'
import { folderById } from '@/data/sampleNotes'
import { useNotes } from '@/context/NotesContext'
import type { FolderId } from '@/types/note'
import { cn } from '@/lib/cn'

export function FolderDetailPage({ compact }: { compact?: boolean }) {
  const { folderId = 'work' } = useParams()
  const { notesInFolder } = useNotes()
  const navigate = useNavigate()
  const folder = folderById(folderId)
  const notes = notesInFolder(folderId as FolderId)

  return (
    <div className={cn('px-4 pt-4', compact ? 'pt-8' : 'lg:px-8 lg:pt-8')}>
      <header className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg p-1 text-sn-navy"
          aria-label="戻る"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-lg font-black text-sn-navy">
            {folder.name}
          </h1>
          <p className="text-xs font-semibold text-sn-muted">{notes.length} NOTE</p>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onClick={() => navigate(`/notes/${note.id}`)}
          />
        ))}
        {notes.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-sn-line bg-white p-8 text-center text-sm text-sn-muted">
            このフォルダにNOTEはありません
          </p>
        )}
      </div>
    </div>
  )
}
