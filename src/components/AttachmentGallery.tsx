import { FileText, X } from 'lucide-react'
import type { Attachment } from '@/types/note'
import { MAX_ATTACHMENTS } from '@/lib/attachments'
import { cn } from '@/lib/cn'

interface AttachmentGalleryProps {
  attachments: Attachment[]
  onRemove?: (id: string) => void
  className?: string
}

export function AttachmentGallery({
  attachments,
  onRemove,
  className,
}: AttachmentGalleryProps) {
  if (attachments.length === 0) {
    return (
      <p className="text-sm text-sn-muted">添付ファイルはありません</p>
    )
  }

  return (
    <div className={cn('grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-3', className)}>
      {attachments.map((a) =>
        a.type === 'image' ? (
          <div
            key={a.id}
            className="relative aspect-square overflow-hidden rounded-xl border border-sn-line"
            style={{
              backgroundImage: a.preview?.startsWith('data:')
                ? `url(${a.preview})`
                : undefined,
              backgroundColor: a.preview?.startsWith('data:')
                ? undefined
                : (a.preview ?? '#CBD5E1'),
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            title={a.name}
          >
            <div className="flex h-full items-end bg-gradient-to-t from-black/40 to-transparent p-1.5">
              <span className="truncate text-[10px] font-medium text-white">
                {a.name}
              </span>
            </div>
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(a.id)}
                className="absolute right-1 top-1 rounded-full bg-black/55 p-0.5 text-white"
                aria-label={`${a.name}を削除`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div
            key={a.id}
            className="relative flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-red-100 bg-red-50 p-2"
            title={a.name}
          >
            <FileText className="h-7 w-7 text-red-500" />
            <span className="line-clamp-2 text-center text-[10px] font-semibold text-red-600">
              {a.name}
            </span>
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(a.id)}
                className="absolute right-1 top-1 rounded-full bg-black/55 p-0.5 text-white"
                aria-label={`${a.name}を削除`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ),
      )}
    </div>
  )
}

export function AttachmentCountLabel({ count }: { count: number }) {
  return (
    <span className="text-xs font-semibold text-sn-muted">
      {count}/{MAX_ATTACHMENTS}
    </span>
  )
}
