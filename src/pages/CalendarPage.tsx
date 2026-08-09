import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Calendar } from '@/components/Calendar'
import { useNotes } from '@/context/NotesContext'
import { DEMO_TODAY } from '@/lib/date'
import { toDateKey } from '@/lib/date'
import { cn } from '@/lib/cn'

export function CalendarPage({ compact }: { compact?: boolean }) {
  const { dateCounts, notesOnDate } = useNotes()
  const navigate = useNavigate()
  const todayKey = toDateKey(DEMO_TODAY)

  return (
    <div className={cn('px-4 pt-4', compact ? 'pt-8' : 'lg:px-8 lg:pt-8')}>
      <header className="mb-4 flex items-center gap-2">
        {compact && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg p-1 text-sn-navy"
            aria-label="戻る"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="font-display text-lg font-black text-sn-navy lg:text-2xl">
          カレンダー
        </h1>
      </header>

      <section className="rounded-2xl border border-sn-line bg-white p-4 shadow-sm lg:p-6">
        <Calendar
          year={2026}
          monthIndex={7}
          todayKey={todayKey}
          dateCounts={dateCounts}
          onSelectDate={(key) => navigate(`/day/${key}`)}
          variant="full"
          showCounts
        />
      </section>

      <section className="mt-5">
        <h2 className="mb-3 font-display text-sm font-bold text-sn-navy">
          今日のNOTE
        </h2>
        <div className="space-y-2">
          {notesOnDate(todayKey).length === 0 ? (
            <p className="text-sm text-sn-muted">今日のNOTEはありません</p>
          ) : (
            notesOnDate(todayKey).map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => navigate(`/notes/${n.id}`)}
                className="flex w-full items-center justify-between rounded-xl border border-sn-line bg-white px-4 py-3 text-left hover:border-sn-blue/30"
              >
                <span className="font-semibold text-sn-navy">{n.title}</span>
                <span className="text-xs font-bold text-sn-blue">
                  {dateCounts[todayKey]} NOTE
                </span>
              </button>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
