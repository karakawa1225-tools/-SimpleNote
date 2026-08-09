import { cn } from '@/lib/cn'

export function Logo({
  className,
  showWordmark = true,
  size = 'md',
}: {
  className?: string
  showWordmark?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  const box = size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-11 w-11' : 'h-9 w-9'
  const text = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg'

  return (
    <div className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-xl bg-sn-blue text-white shadow-sm',
          box,
        )}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="h-[58%] w-[58%]" fill="none">
          <path
            d="M7 5.5h9a1.5 1.5 0 0 1 1.5 1.5v11.2a.6.6 0 0 1-.96.48L13.5 16.5l-2.5 1.8a.6.6 0 0 1-.72 0L8 16.5l-2.54 1.68A.6.6 0 0 1 4.5 17.7V7A1.5 1.5 0 0 1 6 5.5h1z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M9 12.1l1.8 1.8 3.6-3.8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showWordmark && (
        <span className={cn('font-display font-bold tracking-tight text-sn-navy', text)}>
          SimpleNote
        </span>
      )}
    </div>
  )
}
