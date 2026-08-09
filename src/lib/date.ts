/** 日付ユーティリティ（表示は 2026-08-09 基準のデモと整合） */

export function parseDate(iso: string): Date {
  return new Date(iso)
}

export function toDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatDateTime(iso: string): string {
  const d = parseDate(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${y}/${m}/${day} ${hh}:${mm}`
}

export function formatJapaneseDate(d: Date): string {
  const week = ['日', '月', '火', '水', '木', '金', '土']
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${week[d.getDay()]}）`
}

export function greetingForNow(d = new Date()): string {
  const h = d.getHours()
  if (h < 11) return 'おはようございます！'
  if (h < 17) return 'こんにちは！'
  return 'こんばんは！'
}

export function monthLabel(year: number, monthIndex: number): string {
  return `${year}年${monthIndex + 1}月`
}

export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate()
}

export function startWeekday(year: number, monthIndex: number): number {
  return new Date(year, monthIndex, 1).getDay()
}

/** デモの「今日」は参考デザインに合わせて 2026-08-09 */
export const DEMO_TODAY = new Date(2026, 7, 9)
