import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { daysInMonth, monthLabel, startWeekday, toDateKey } from '@/lib/date'
import { cn } from '@/lib/cn'

const WEEK = ['日', '月', '火', '水', '木', '金', '土']

interface CalendarProps {
  /** 初期表示年（省略時は今日） */
  initialYear?: number
  /** 初期表示月 0-11（省略時は今日） */
  initialMonthIndex?: number
  selectedKey?: string
  todayKey?: string
  dateCounts: Record<string, number>
  onSelectDate: (dateKey: string) => void
  variant?: 'compact' | 'full'
  showCounts?: boolean
  className?: string
}

function shiftMonth(year: number, monthIndex: number, delta: number) {
  const d = new Date(year, monthIndex + delta, 1)
  return { year: d.getFullYear(), monthIndex: d.getMonth() }
}

export function Calendar({
  initialYear,
  initialMonthIndex,
  selectedKey,
  todayKey,
  dateCounts,
  onSelectDate,
  variant = 'compact',
  showCounts = false,
  className,
}: CalendarProps) {
  const fallback = todayKey ? new Date(`${todayKey}T12:00:00`) : new Date()
  const [year, setYear] = useState(initialYear ?? fallback.getFullYear())
  const [monthIndex, setMonthIndex] = useState(
    initialMonthIndex ?? fallback.getMonth(),
  )

  const days = daysInMonth(year, monthIndex)
  const start = startWeekday(year, monthIndex)
  const cells: Array<number | null> = [
    ...Array.from({ length: start }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ]

  const goPrev = () => {
    const next = shiftMonth(year, monthIndex, -1)
    setYear(next.year)
    setMonthIndex(next.monthIndex)
  }

  const goNext = () => {
    const next = shiftMonth(year, monthIndex, 1)
    setYear(next.year)
    setMonthIndex(next.monthIndex)
  }

  const goTodayMonth = () => {
    const d = todayKey ? new Date(`${todayKey}T12:00:00`) : new Date()
    setYear(d.getFullYear())
    setMonthIndex(d.getMonth())
  }

  const isCurrentMonth =
    year === fallback.getFullYear() && monthIndex === fallback.getMonth()

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={goPrev}
          className="rounded-lg p-1.5 text-sn-navy transition hover:bg-sn-blue-soft"
          aria-label="前の月"
        >
          <ChevronLeft className={variant === 'full' ? 'h-5 w-5' : 'h-4 w-4'} />
        </button>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
          <h3
            className={cn(
              'font-display font-bold text-sn-navy',
              variant === 'full' ? 'text-lg' : 'text-sm',
            )}
          >
            {monthLabel(year, monthIndex)}
          </h3>
          {!isCurrentMonth && (
            <button
              type="button"
              onClick={goTodayMonth}
              className="shrink-0 rounded-md bg-sn-blue-soft px-2 py-0.5 text-[10px] font-bold text-sn-blue"
            >
              今月
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={goNext}
          className="rounded-lg p-1.5 text-sn-navy transition hover:bg-sn-blue-soft"
          aria-label="次の月"
        >
          <ChevronRight className={variant === 'full' ? 'h-5 w-5' : 'h-4 w-4'} />
        </button>
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
          NOTEがある日には青いドットが表示されます。矢印で月を移動できます。
        </p>
      )}
    </div>
  )
}
