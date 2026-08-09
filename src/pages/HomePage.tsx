import { Sun } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar } from '@/components/Calendar'
import { NoteCard } from '@/components/NoteCard'
import { QuickActions } from '@/components/QuickActions'
import { useNotes } from '@/context/NotesContext'
import { formatJapaneseDate, greetingForNow, toDateKey, DEMO_TODAY } from '@/lib/date'
import { isEmbeddedFrame } from '@/lib/embed'
import { cn } from '@/lib/cn'

export function HomePage({ compact: compactProp }: { compact?: boolean }) {
  const compact = compactProp ?? isEmbeddedFrame()
  const { activeNotes, dateCounts } = useNotes()
  const navigate = useNavigate()
  const todayKey = toDateKey(DEMO_TODAY)
  const recent = activeNotes.slice(0, 6)

  return (
    <div className={cn('px-4 pt-4', compact ? 'pt-8' : 'md:px-6 md:pt-6')}>
      {/* スマホ: ハンバーガーは AppShell 側 */}
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3 md:mb-6">
        <div>
          <p className="mb-1 hidden text-sm font-semibold text-sn-muted md:block">HOME</p>
          <div className="flex items-center gap-2">
            <p
              className={cn(
                'font-display font-black text-sn-navy',
                compact ? 'text-lg' : 'text-2xl md:text-3xl',
              )}
            >
              {greetingForNow(DEMO_TODAY)}
            </p>
            <Sun className="h-5 w-5 text-sn-yellow" fill="currentColor" />
          </div>
          <p
            className={cn(
              'mt-1 font-semibold text-sn-muted',
              compact ? 'text-xs' : 'text-sm',
            )}
          >
            {formatJapaneseDate(DEMO_TODAY)}
          </p>
        </div>
        <Link
          to="/new"
          className="hidden items-center rounded-xl bg-sn-blue px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-sn-blue/25 hover:bg-sn-blue-dark md:inline-flex"
        >
          ＋ 新しいNOTE
        </Link>
      </header>

      <Link
        to="/new"
        className="mb-4 flex w-full items-center justify-center rounded-xl bg-sn-blue py-3 text-sm font-bold text-white shadow-md shadow-sn-blue/30 md:hidden"
      >
        ＋ 新しいNOTE
      </Link>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:gap-6">
        <section className="rounded-2xl border border-sn-line bg-white p-3 shadow-sm md:p-5">
          <Calendar
            year={2026}
            monthIndex={7}
            todayKey={todayKey}
            dateCounts={dateCounts}
            onSelectDate={(key) => navigate(`/day/${key}`)}
            variant={compact ? 'compact' : 'full'}
          />
        </section>

        <section className="hidden rounded-2xl border border-sn-line bg-white p-4 shadow-sm md:block md:p-5">
          <h3 className="mb-3 font-display text-sm font-bold text-sn-navy">
            クイックメニュー
          </h3>
          <QuickActions />
        </section>
      </div>

      <section className="mt-5 md:mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-sn-navy md:text-base">
            最近のNOTE
          </h3>
          <Link to="/notes" className="text-xs font-bold text-sn-blue">
            すべて見る
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-1 md:overflow-visible lg:grid-cols-2">
          {recent.map((note) => (
            <div key={note.id} className="w-[70%] shrink-0 md:w-auto md:shrink">
              <NoteCard
                note={note}
                compact={compact}
                onClick={() => navigate(`/notes/${note.id}`)}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
