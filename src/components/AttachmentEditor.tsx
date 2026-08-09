import { Paperclip } from 'lucide-react'
import { useRef } from 'react'
import { AttachmentCountLabel, AttachmentGallery } from '@/components/AttachmentGallery'
import { createId } from '@/lib/storage'
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

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function AttachmentEditor({
  attachments,
  onChange,
  className,
}: AttachmentEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const remaining = MAX_ATTACHMENTS - attachments.length
  const atLimit = remaining <= 0

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || atLimit) return
    const selected = Array.from(files).slice(0, remaining)
    const created: Attachment[] = []

    for (let i = 0; i < selected.length; i++) {
      const file = selected[i]
      const isPdf =
        file.type === 'application/pdf' ||
        file.name.toLowerCase().endsWith('.pdf')
      const isImage = file.type.startsWith('image/')

      if (!isPdf && !isImage) continue

      if (isPdf) {
        created.push({
          id: createId('att'),
          type: 'pdf',
          name: file.name,
        })
      } else {
        let preview: string
        try {
          preview = await readFileAsDataUrl(file)
        } catch {
          preview =
            IMAGE_PLACEHOLDER_COLORS[
              (attachments.length + i) % IMAGE_PLACEHOLDER_COLORS.length
            ]
        }
        created.push({
          id: createId('att'),
          type: 'image',
          name: file.name,
          preview,
        })
      }
    }

    if (created.length > 0) onChange([...attachments, ...created])
    if (inputRef.current) inputRef.current.value = ''
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
        disabled={atLimit}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-3 text-sm font-bold transition',
          atLimit
            ? 'cursor-not-allowed border-sn-line bg-sn-bg text-sn-muted/60'
            : 'border-sn-line bg-white text-sn-ink hover:border-sn-blue/40 hover:bg-sn-blue-soft',
        )}
      >
        <Paperclip className="h-4 w-4" />
        {atLimit
          ? `添付は最大${MAX_ATTACHMENTS}件までです`
          : `＋ 写真・PDFを添付（残り${remaining}）`}
      </button>
    </div>
  )
}
