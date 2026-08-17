import { ChevronLeft, ChevronRight, Download, X } from 'lucide-react'
import { useEffect } from 'react'
import { downloadBlob, getFile } from '@/lib/fileStore'
import { useStoredFileUrl } from '@/lib/useStoredFileUrl'
import type { Attachment } from '@/types/note'
import { cn } from '@/lib/cn'

interface AttachmentViewerProps {
  attachments: Attachment[]
  index: number
  onClose: () => void
  onIndexChange: (index: number) => void
}

export function AttachmentViewer({
  attachments,
  index,
  onClose,
  onIndexChange,
}: AttachmentViewerProps) {
  const current = attachments[index]
  const { url, loading } = useStoredFileUrl(current?.id ?? '', current?.preview)
  const isImage = current?.type === 'image'

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onIndexChange(Math.max(0, index - 1))
      if (e.key === 'ArrowRight') {
        onIndexChange(Math.min(attachments.length - 1, index + 1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [attachments.length, index, onClose, onIndexChange])

  if (!current) return null

  const handleDownload = async () => {
    const stored = await getFile(current.id)
    if (stored) {
      downloadBlob(stored.blob, stored.name || current.name)
      return
    }
    if (current.preview?.startsWith('data:')) {
      const a = document.createElement('a')
      a.href = current.preview
      a.download = current.name
      a.click()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex flex-col bg-black/88"
      role="dialog"
      aria-modal
      aria-label={current.name}
      onClick={onClose}
    >
      <header
        className="flex items-center gap-2 px-3 py-3 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="min-w-0 flex-1 truncate text-sm font-semibold">
          {current.name}
        </p>
        <button
          type="button"
          onClick={() => void handleDownload()}
          className="rounded-lg p-2 hover:bg-white/10"
          aria-label="端末に保存"
        >
          <Download className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 hover:bg-white/10"
          aria-label="閉じる"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-12 py-4"
        onClick={(e) => e.stopPropagation()}
      >
        {attachments.length > 1 && (
          <button
            type="button"
            disabled={index === 0}
            onClick={() => onIndexChange(index - 1)}
            className="absolute left-2 rounded-full bg-white/15 p-2 text-white disabled:opacity-30"
            aria-label="前へ"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {loading && (
          <p className="text-sm font-semibold text-white/80">読み込み中…</p>
        )}

        {!loading && url && isImage && (
          <img
            src={url}
            alt={current.name}
            className="max-h-full max-w-full object-contain"
          />
        )}

        {!loading && url && !isImage && (
          <iframe
            title={current.name}
            src={url}
            className="h-full w-full rounded-lg bg-white"
          />
        )}

        {!loading && !url && (
          <p className="px-6 text-center text-sm font-semibold text-white/80">
            このファイルの実体が見つかりません。もう一度添付してください。
          </p>
        )}

        {attachments.length > 1 && (
          <button
            type="button"
            disabled={index === attachments.length - 1}
            onClick={() => onIndexChange(index + 1)}
            className="absolute right-2 rounded-full bg-white/15 p-2 text-white disabled:opacity-30"
            aria-label="次へ"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      <p
        className="pb-4 text-center text-xs text-white/70"
        onClick={(e) => e.stopPropagation()}
      >
        ダウンロードでスマホ／PCのフォルダに保存できます
      </p>
    </div>
  )
}

export function attachmentThumbStyle(preview?: string) {
  if (preview?.startsWith('data:')) {
    return { backgroundImage: `url(${preview})` as const }
  }
  return { backgroundColor: preview ?? '#CBD5E1' }
}

export function AttachmentThumb({
  id,
  preview,
  className,
}: {
  id: string
  preview?: string
  className?: string
}) {
  const { url } = useStoredFileUrl(id, preview)
  return (
    <span
      className={cn('block h-full w-full bg-cover bg-center', className)}
      style={
        url
          ? { backgroundImage: `url(${url})` }
          : attachmentThumbStyle(preview)
      }
    />
  )
}
