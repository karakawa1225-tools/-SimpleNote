import {
  Folder,
  Plus,
  Search,
  Star,
  Trash2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

const actions = [
  {
    to: '/new',
    label: 'NEW NOTE',
    icon: Plus,
    primary: true,
  },
  { to: '/search', label: '検索', icon: Search },
  { to: '/favorites', label: 'お気に入り', icon: Star },
  { to: '/folders', label: 'フォルダ', icon: Folder },
  { to: '/trash', label: 'ゴミ箱', icon: Trash2 },
] as const

export function QuickActions({ compact }: { compact?: boolean }) {
  return (
    <div className={cn('flex flex-col gap-2', compact && 'gap-1.5')}>
      {actions.map((a) => {
        const Icon = a.icon
        const primary = 'primary' in a && a.primary
        return (
          <Link
            key={a.to}
            to={a.to}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition',
              compact ? 'px-3 py-2.5 text-xs' : 'px-4 py-3 text-sm',
              primary
                ? 'bg-sn-blue text-white shadow-md shadow-sn-blue/25 hover:bg-sn-blue-dark'
                : 'border border-sn-line bg-white text-sn-ink hover:border-sn-blue/30 hover:bg-sn-blue-soft',
            )}
          >
            <Icon className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
            {primary ? `＋ ${a.label}` : a.label}
          </Link>
        )
      })}
    </div>
  )
}
