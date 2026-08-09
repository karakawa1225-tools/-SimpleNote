import { ChevronLeft, Folder, Save, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AttachmentEditor } from '@/components/AttachmentEditor'
import { folderById } from '@/data/sampleNotes'
import { useNotes } from '@/context/NotesContext'
import { formatDateTime } from '@/lib/date'
import { isEmbeddedFrame } from '@/lib/embed'
import type { Attachment } from '@/types/note'
import { cn } from '@/lib/cn'

export function NoteDetailPage({ compact: compactProp }: { compact?: boolean }) {
  const compact = compactProp ?? isEmbeddedFrame()
  const { id = '' } = useParams()
  const { getNote, toggleFavorite, updateNote } = useNotes()
  const navigate = useNavigate()
  const note = getNote(id)

  const [title, setTitle] = useState(note?.title ?? '')
  const [body, setBody] = useState(note?.body ?? '')
  const [memo, setMemo] = useState(note?.memo ?? '')
  const [attachments, setAttachments] = useState<Attachment[]>(
    note?.attachments ?? [],
  )

  useEffect(() => {
    if (!note) return
    setTitle(note.title)
    setBody(note.body)
    setMemo(note.memo)
    setAttachments(note.attachments)
  }, [note])

  if (!note || note.trashed) {
    return (
      <div className="px-4 pt-10 text-center text-sm text-sn-muted">
        NOTEが見つかりません
        <button
          type="button"
          className="mt-4 block w-full font-bold text-sn-blue"
          onClick={() => navigate('/home')}
        >
          HOMEへ戻る
        </button>
      </div>
    )
  }

  const folder = folderById(note.folderId)

  const save = () => {
    updateNote(note.id, { title, body, memo, attachments })
    navigate('/home')
  }

  return (
    <div
      className={cn(
        'flex min-h-full flex-col px-4 pt-4',
        compact ? 'pt-8' : 'md:px-6 md:pt-6',
      )}
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg p-1 text-sn-navy md:hidden"
            aria-label="戻る"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="inline-flex min-w-0 items-center gap-1.5 truncate text-xs font-bold text-sn-muted">
            <Folder className="h-3.5 w-3.5 shrink-0" style={{ color: folder.color }} />
            {folder.name}
          </span>
        </div>
        <button
          type="button"
          onClick={() => toggleFavorite(note.id)}
          className="rounded-lg p-1.5"
          aria-label="お気に入り"
        >
          <Star
            className={cn(
              'h-5 w-5',
              note.favorite ? 'fill-sn-yellow text-sn-yellow' : 'text-sn-muted',
            )}
          />
        </button>
      </header>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={cn(
          'w-full bg-transparent font-display font-black text-sn-navy outline-none',
          compact ? 'text-xl' : 'text-2xl',
        )}
      />
      <p className="mt-1 text-xs font-semibold text-sn-muted">
        {formatDateTime(note.updatedAt)}
      </p>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="mt-4 min-h-[40vh] w-full flex-1 resize-y bg-transparent text-sm leading-7 text-sn-ink outline-none md:min-h-[320px]"
        placeholder="本文"
      />

      <section className="mt-6">
        <AttachmentEditor attachments={attachments} onChange={setAttachments} />
      </section>

      <section className="mt-6">
        <h2 className="mb-2 font-display text-sm font-bold text-sn-navy">メモ</h2>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-2xl border border-amber-200/80 bg-sn-yellow-soft px-4 py-3 text-sm leading-7 text-sn-navy outline-none"
          placeholder="メモを入力"
        />
      </section>

      <div className="mt-auto flex gap-2 pb-4 pt-8">
        <button
          type="button"
          onClick={save}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-sn-blue py-3 text-sm font-bold text-white shadow-md shadow-sn-blue/25"
        >
          <Save className="h-4 w-4" />
          保存
        </button>
      </div>
    </div>
  )
}
