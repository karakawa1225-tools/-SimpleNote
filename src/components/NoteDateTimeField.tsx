import { useEffect, useState } from 'react'
import { formatDateTime, toDateTimeLocalValue } from '@/lib/date'
import { cn } from '@/lib/cn'

export type DateTimeMode = 'none' | 'now' | 'custom'

interface NoteDateTimeFieldProps {
  mode: DateTimeMode
  customValue: string
  onModeChange: (mode: DateTimeMode) => void
  onCustomChange: (value: string) => void
  className?: string
}

export function NoteDateTimeField({
  mode,
  customValue,
  onModeChange,
  onCustomChange,
  className,
}: NoteDateTimeFieldProps) {
  const [nowIso, setNowIso] = useState(() => new Date().toISOString())

  useEffect(() => {
    if (mode !== 'now') return
    const tick = () => setNowIso(new Date().toISOString())
    tick()
    const id = window.setInterval(tick, 15_000)
    return () => window.clearInterval(id)
  }, [mode])

  const showDate = mode !== 'none'

  return (
    <div className={cn('mb-4 space-y-2', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-sn-muted">タイトル下の日時</span>
        <div className="inline-flex rounded-lg border border-sn-line bg-white p-0.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => onModeChange('none')}
            className={cn(
              'rounded-md px-3 py-1.5 transition',
              mode === 'none'
                ? 'bg-sn-blue text-white'
                : 'text-sn-muted hover:text-sn-navy',
            )}
          >
            入れない
          </button>
          <button
            type="button"
            onClick={() => onModeChange(mode === 'custom' ? 'custom' : 'now')}
            className={cn(
              'rounded-md px-3 py-1.5 transition',
              showDate
                ? 'bg-sn-blue text-white'
                : 'text-sn-muted hover:text-sn-navy',
            )}
          >
            入れる
          </button>
        </div>
      </div>

      {showDate && (
        <div className="space-y-2 rounded-xl border border-sn-line bg-sn-bg/60 p-3">
          <div className="inline-flex rounded-lg border border-sn-line bg-white p-0.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => onModeChange('now')}
              className={cn(
                'rounded-md px-3 py-1.5 transition',
                mode === 'now'
                  ? 'bg-sn-navy text-white'
                  : 'text-sn-muted hover:text-sn-navy',
              )}
            >
              今の時間
            </button>
            <button
              type="button"
              onClick={() => {
                if (!customValue) {
                  onCustomChange(toDateTimeLocalValue(new Date()))
                }
                onModeChange('custom')
              }}
              className={cn(
                'rounded-md px-3 py-1.5 transition',
                mode === 'custom'
                  ? 'bg-sn-navy text-white'
                  : 'text-sn-muted hover:text-sn-navy',
              )}
            >
              自由選択
            </button>
          </div>

          {mode === 'now' ? (
            <p className="text-sm font-semibold text-sn-navy">
              {formatDateTime(nowIso)}
            </p>
          ) : (
            <input
              type="datetime-local"
              value={customValue}
              onChange={(e) => onCustomChange(e.target.value)}
              className="w-full rounded-xl border border-sn-line bg-white px-3 py-2.5 text-sm font-semibold text-sn-navy outline-none focus:border-sn-blue"
            />
          )}
        </div>
      )}
    </div>
  )
}

/** 保存時の表示用日時（ISO）。入れない場合は null */
export function resolveDisplayAt(
  mode: DateTimeMode,
  customLocalValue: string,
): string | null {
  if (mode === 'none') return null
  if (mode === 'now') return new Date().toISOString()
  if (!customLocalValue) return new Date().toISOString()
  const d = new Date(customLocalValue)
  if (Number.isNaN(d.getTime())) return new Date().toISOString()
  return d.toISOString()
}
