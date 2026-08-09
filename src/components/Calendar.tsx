import { daysInMonth, monthLabel, startWeekday, toDateKey } from '@/lib/date'
import { cn } from '@/lib/cn'

const WEEK = ['日', '月', '火', '水', '木', '金', '土']

interface CalendarProps {
  year: number
  monthIndex: number
  selectedKey?: string
  todayKey?: string
  dateCounts: Record<string, number>
  onSelectDate: (dateKey: string) => void
  variant?: 'compact' | 'full'
  showCounts?: boolean
  className?: string
}

export function Calendar({
  year,
  monthIndex,
  selectedKey,
  todayKey,
  dateCounts,
  onSelectDate,
  variant = 'compact',
  showCounts = false,
  className,
}: CalendarProps) {
  const days = daysInMonth(year, monthIndex)
  const start = startWeekday(year, monthIndex)
  const cells: Array<number | null> = [
    ...Array.from({ length: start }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ]

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-2 flex items-center justify-between">
        <h3
          className={cn(
            'font-display font-bold text-sn-navy',
            variant === 'full' ? 'text-lg' : 'text-sm',
          )}
        >
          {monthLabel(year, monthIndex)}
        </h3>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEK.map((w) => (
          <div
            key={w}
            className={cn(
              'font-semibold text-sn-muted',
              variant === 'full' ? 'pb-2 text-xs' : 'pb-1 text-[10px]',
            )}
          >
            {w}
          </div>
        ))}
        {cells.map((day, idx) => {
          if (day == null) return <div key={`e-${idx}`} />
          const key = toDateKey(new Date(year, monthIndex, day))
          const count = dateCounts[key] ?? 0
          const isToday = key === todayKey
          const isSelected = key === selectedKey
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDate(key)}
              className={cn(
                'relative mx-auto flex flex-col items-center justify-center rounded-full transition',
                variant === 'full' ? 'h-11 w-11 text-sm' : 'h-8 w-8 text-xs',
                isToday || isSelected
                  ? 'bg-sn-blue font-bold text-white shadow-sm'
                  : 'text-sn-ink hover:bg-sn-blue-soft',
              )}
            >
              <span>{day}</span>
              {count > 0 && !isToday && !isSelected && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-sn-blue" />
              )}
              {showCounts && count > 0 && (isToday || isSelected) && (
                <span className="absolute -bottom-0.5 text-[8px] leading-none opacity-90">
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
      {variant === 'full' && (
        <p className="mt-3 text-center text-xs text-sn-muted">
          NOTEがある日には青いドットが表示されます
        </p>
      )}
    </div>
  )
}
