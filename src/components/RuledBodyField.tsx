import { cn } from '@/lib/cn'

interface RuledBodyFieldProps {
  value: string
  onChange: (value: string) => void
  ruled: boolean
  onRuledChange: (ruled: boolean) => void
  placeholder?: string
  className?: string
  minHeightClass?: string
}

export function RuledBodyField({
  value,
  onChange,
  ruled,
  onRuledChange,
  placeholder = '本文を入力',
  className,
  minHeightClass = 'min-h-[50vh] md:min-h-[420px]',
}: RuledBodyFieldProps) {
  return (
    <div className={cn('flex min-h-0 flex-1 flex-col', className)}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-sn-muted">本文</span>
        <div className="inline-flex rounded-lg border border-sn-line bg-white p-0.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => onRuledChange(false)}
            className={cn(
              'rounded-md px-3 py-1.5 transition',
              !ruled ? 'bg-sn-blue text-white' : 'text-sn-muted hover:text-sn-navy',
            )}
          >
            罫線なし
          </button>
          <button
            type="button"
            onClick={() => onRuledChange(true)}
            className={cn(
              'rounded-md px-3 py-1.5 transition',
              ruled ? 'bg-sn-blue text-white' : 'text-sn-muted hover:text-sn-navy',
            )}
          >
            罫線あり
          </button>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full flex-1 resize-y rounded-xl border border-sn-line bg-white text-sm outline-none focus:border-sn-blue',
          minHeightClass,
          ruled
            ? 'ruled-paper'
            : 'px-3 py-3 leading-7',
        )}
      />
    </div>
  )
}
