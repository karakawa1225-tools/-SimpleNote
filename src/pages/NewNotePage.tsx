import { ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AttachmentEditor } from '@/components/AttachmentEditor'
import { FOLDERS } from '@/data/sampleNotes'
import { useNotes } from '@/context/NotesContext'
import { formatDateTime } from '@/lib/date'
import { isEmbeddedFrame } from '@/lib/embed'
import type { Attachment, FolderId } from '@/types/note'
import { cn } from '@/lib/cn'

export function NewNotePage({ compact: compactProp }: { compact?: boolean }) {
  const compact = compactProp ?? isEmbeddedFrame()
  const { addNote } = useNotes()
  const navigate = useNavigate()
  const [folderId, setFolderId] = useState<FolderId>('work')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [memo, setMemo] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [nowIso, setNowIso] = useState(() => new Date().toISOString())

  useEffect(() => {
    const id = window.setInterval(() => {
      setNowIso(new Date().toISOString())
    }, 30_000)
    return () => window.clearInterval(id)
  }, [])

  const save = () => {
    const note = addNote({ title, body, memo, folderId, attachments })
    navigate(`/notes/${note.id}`)
  }

  return (
    <div
      className={cn(
        'flex min-h-full flex-col px-4 pt-4',
        compact ? 'pt-8' : 'md:px-6 md:pt-6',
      )}
    >
      <header className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg p-1 text-sn-navy"
          aria-label="戻る"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-lg font-black text-sn-navy">
          新しいNOTE
        </h1>
      </header>

      <label className="mb-4 block">
        <span className="mb-1.5 block text-xs font-bold text-sn-muted">フォルダ</span>
        <select
          value={folderId}
          onChange={(e) => setFolderId(e.target.value as FolderId)}
          className="w-full rounded-xl border border-sn-line bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sn-blue"
        >
          {FOLDERS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </label>

      <label className="mb-1 block">
        <span className="mb-1.5 block text-xs font-bold text-sn-muted">タイトル</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトルを入力"
          className="w-full rounded-xl border border-sn-line bg-white px-3 py-3 text-base font-bold outline-none focus:border-sn-blue"
        />
      </label>
      <p className="mb-4 text-xs font-semibold text-sn-muted">
        {formatDateTime(nowIso)}
      </p>

      <label className="mb-4 flex min-h-0 flex-1 flex-col">
        <span className="mb-1.5 block text-xs font-bold text-sn-muted">本文</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="本文を入力"
          className={cn(
            'w-full flex-1 resize-y rounded-xl border border-sn-line bg-white px-3 py-3 text-sm leading-7 outline-none focus:border-sn-blue',
            'min-h-[50vh] md:min-h-[420px]',
          )}
        />
      </label>

      <div className="mb-4">
        <AttachmentEditor attachments={attachments} onChange={setAttachments} />
      </div>

      <label className="mb-4 block">
        <span className="mb-1.5 block text-xs font-bold text-sn-muted">メモ</span>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="メモを入力"
          rows={4}
          className="w-full resize-none rounded-xl border border-amber-200 bg-sn-yellow-soft px-3 py-3 text-sm leading-6 outline-none focus:border-sn-yellow"
        />
      </label>

      <button
        type="button"
        onClick={save}
        className="mb-6 w-full rounded-xl bg-sn-blue py-3.5 text-sm font-bold text-white shadow-md shadow-sn-blue/25 hover:bg-sn-blue-dark"
      >
        保存する
      </button>
    </div>
  )
}
