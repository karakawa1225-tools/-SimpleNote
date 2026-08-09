import { useMemo } from 'react'
import { cn } from '@/lib/cn'

/**
 * LP内の操作デモ用。親の BrowserRouter とネストしないよう iframe で独立起動する。
 */
export function PhoneMockup({
  className,
  initialPath = '/home',
  height = 640,
}: {
  className?: string
  initialPath?: string
  height?: number
}) {
  const src = useMemo(() => {
    return initialPath.startsWith('/') ? initialPath : `/${initialPath}`
  }, [initialPath])

  return (
    <div className={cn('relative mx-auto w-full max-w-[320px]', className)}>
      <div className="phone-frame rounded-[2.4rem] p-[10px]">
        <div className="relative overflow-hidden rounded-[1.9rem] bg-white">
          <div className="pointer-events-none absolute left-1/2 top-0 z-30 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-[#0d121c]" />
          <iframe
            title="SimpleNote demo"
            src={src}
            className="block w-full border-0 bg-white"
            style={{ height }}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  )
}
