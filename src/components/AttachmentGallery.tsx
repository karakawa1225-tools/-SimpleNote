import { FileText, X } from 'lucide-react'
import { useState } from 'react'
import {
  AttachmentThumb,
  AttachmentViewer,
} from '@/components/AttachmentViewer'
import { MAX_ATTACHMENTS } from '@/lib/attachments'
import { cn } from '@/lib/cn'
import type { Attachment } from '@/types/note'

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
  const [viewIndex, setViewIndex] = useState<number | null>(null)

  if (attachments.length === 0) {
    return (
      <p className="text-sm text-sn-muted">添付ファイルはありません</p>
    )
  }

  return (
    <>
      <div className={cn('grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-3', className)}>
        {attachments.map((a, i) =>
          a.type === 'image' ? (
            <div
              key={a.id}
              className="relative aspect-square overflow-hidden rounded-xl border border-sn-line"
            >
              <button
                type="button"
                onClick={() => setViewIndex(i)}
                className="absolute inset-0"
                title={`${a.name}を開く`}
              >
                <AttachmentThumb id={a.id} preview={a.preview} />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-1.5 text-left">
                  <span className="block truncate text-[10px] font-medium text-white">
                    {a.name}
                  </span>
                </span>
              </button>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(a.id)}
                  className="absolute right-1 top-1 z-10 rounded-full bg-black/55 p-0.5 text-white"
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
            >
              <button
                type="button"
                onClick={() => setViewIndex(i)}
                className="flex h-full w-full flex-col items-center justify-center gap-1"
                title={`${a.name}を開く`}
              >
                <FileText className="h-7 w-7 text-red-500" />
                <span className="line-clamp-2 text-center text-[10px] font-semibold text-red-600">
                  {a.name}
                </span>
              </button>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(a.id)}
                  className="absolute right-1 top-1 z-10 rounded-full bg-black/55 p-0.5 text-white"
                  aria-label={`${a.name}を削除`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ),
        )}
      </div>

      {viewIndex != null && (
        <AttachmentViewer
          attachments={attachments}
          index={viewIndex}
          onClose={() => setViewIndex(null)}
          onIndexChange={setViewIndex}
        />
      )}
    </>
  )
}

export function AttachmentCountLabel({ count }: { count: number }) {
  return (
    <span className="text-xs font-semibold text-sn-muted">
      {count}/{MAX_ATTACHMENTS}
    </span>
  )
}
