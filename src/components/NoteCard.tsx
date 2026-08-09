import { FileText, Image as ImageIcon } from 'lucide-react'
import { folderById } from '@/data/sampleNotes'
import { formatDateTime } from '@/lib/date'
import { cn } from '@/lib/cn'
import type { Note } from '@/types/note'

interface NoteCardProps {
  note: Note
  onClick?: () => void
  compact?: boolean
}

export function NoteCard({ note, onClick, compact }: NoteCardProps) {
  const folder = folderById(note.folderId)
  const images = note.attachments.filter((a) => a.type === 'image').length
  const pdfs = note.attachments.filter((a) => a.type === 'pdf').length

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full rounded-2xl border border-sn-line bg-white text-left transition hover:border-sn-blue/30 hover:shadow-md',
        compact ? 'min-w-[11.5rem] p-3' : 'p-4',
      )}
    >
      <span
        className="mb-2 inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold text-white"
        style={{ backgroundColor: folder.color }}
      >
        {folder.name}
      </span>
      <h4
        className={cn(
          'font-display font-bold text-sn-navy line-clamp-2',
          compact ? 'text-sm' : 'text-base',
        )}
      >
        {note.title}
      </h4>
      <p className="mt-1 text-[11px] text-sn-muted">{formatDateTime(note.updatedAt)}</p>
      {!compact && (
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-sn-muted">
          {note.body}
        </p>
      )}
      {(images > 0 || pdfs > 0) && (
        <div className="mt-2 flex items-center gap-2 text-[11px] text-sn-muted">
          {images > 0 && (
            <span className="inline-flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              写真{images}枚
            </span>
          )}
          {pdfs > 0 && (
            <span className="inline-flex items-center gap-1">
              <FileText className="h-3 w-3 text-red-500" />
              PDF {pdfs}件
            </span>
          )}
        </div>
      )}
      {note.attachments.length > 0 && (
        <div className="mt-2 flex gap-1.5">
          {note.attachments.slice(0, 3).map((a) =>
            a.type === 'image' ? (
              <span
                key={a.id}
                className="h-8 w-8 overflow-hidden rounded-md"
                style={{ background: a.preview ?? '#CBD5E1' }}
                title={a.name}
              />
            ) : (
              <span
                key={a.id}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-[9px] font-bold text-red-500"
                title={a.name}
              >
                PDF
              </span>
            ),
          )}
        </div>
      )}
    </button>
  )
}
