import { Paperclip } from 'lucide-react'
import { useRef, useState } from 'react'
import { AttachmentCountLabel, AttachmentGallery } from '@/components/AttachmentGallery'
import { createId } from '@/lib/storage'
import { prepareImageFile } from '@/lib/imageCompress'
import { putFile } from '@/lib/fileStore'
import {
  IMAGE_PLACEHOLDER_COLORS,
  MAX_ATTACHMENTS,
} from '@/lib/attachments'
import type { Attachment } from '@/types/note'
import { cn } from '@/lib/cn'

interface AttachmentEditorProps {
  attachments: Attachment[]
  onChange: (next: Attachment[]) => void
  className?: string
}

export function AttachmentEditor({
  attachments,
  onChange,
  className,
}: AttachmentEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [attachError, setAttachError] = useState<string | null>(null)
  const remaining = MAX_ATTACHMENTS - attachments.length
  const atLimit = remaining <= 0

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || atLimit || busy) return
    setBusy(true)
    setAttachError(null)
    const selected = Array.from(files).slice(0, remaining)
    const created: Attachment[] = []

    try {
      for (let i = 0; i < selected.length; i++) {
        const file = selected[i]
        const isPdf =
          file.type === 'application/pdf' ||
          file.name.toLowerCase().endsWith('.pdf')
        const isImage = file.type.startsWith('image/')

        if (!isPdf && !isImage) continue

        const id = createId('att')

        if (isPdf) {
          await putFile({
            id,
            name: file.name,
            mime: file.type || 'application/pdf',
            blob: file,
          })
          created.push({
            id,
            type: 'pdf',
            name: file.name,
          })
          continue
        }

        const prepared = await prepareImageFile(file)
        await putFile({
          id,
          name: file.name,
          mime: prepared.mime,
          blob: prepared.blob,
        })
        created.push({
          id,
          type: 'image',
          name: file.name,
          preview:
            prepared.thumb ||
            IMAGE_PLACEHOLDER_COLORS[
              (attachments.length + i) % IMAGE_PLACEHOLDER_COLORS.length
            ],
        })
      }

      if (created.length > 0) onChange([...attachments, ...created])
      if (created.length < selected.length) {
        setAttachError(
          '一部のファイルは追加できませんでした（対応形式は画像とPDFです）。',
        )
      }
    } catch {
      setAttachError('添付の処理中にエラーが発生しました。別の画像でお試しください。')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-sn-muted">写真・PDF</span>
        <AttachmentCountLabel count={attachments.length} />
      </div>

      <AttachmentGallery
        attachments={attachments}
        onRemove={(id) => onChange(attachments.filter((a) => a.id !== id))}
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf,.pdf"
        multiple
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />

      <button
        type="button"
        disabled={atLimit || busy}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-3 text-sm font-bold transition',
          atLimit || busy
            ? 'cursor-not-allowed border-sn-line bg-sn-bg text-sn-muted/60'
            : 'border-sn-line bg-white text-sn-ink hover:border-sn-blue/40 hover:bg-sn-blue-soft',
        )}
      >
        <Paperclip className="h-4 w-4" />
        {busy
          ? 'ファイルを保存中…'
          : atLimit
            ? `添付は最大${MAX_ATTACHMENTS}件までです`
            : `＋ 写真・PDFを添付（残り${remaining}）`}
      </button>

      {attachError && (
        <p className="text-xs font-semibold text-red-600">{attachError}</p>
      )}
      <p className="text-[11px] leading-5 text-sn-muted">
        写真・PDFの実ファイルは端末内に保存されます。タップで拡大表示、ダウンロードでフォルダに保存できます。
      </p>
    </div>
  )
}
