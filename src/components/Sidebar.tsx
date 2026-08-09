import {
  CalendarDays,
  Folder,
  HelpCircle,
  Home,
  NotebookPen,
  Search,
  Settings,
  Star,
  Trash2,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { FOLDERS } from '@/data/sampleNotes'
import { useNotes } from '@/context/NotesContext'
import { cn } from '@/lib/cn'

const nav = [
  { to: '/home', label: 'HOME', icon: Home, end: true },
  { to: '/notes', label: 'All NOTE', icon: NotebookPen },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/favorites', label: 'Favorites', icon: Star },
  { to: '/trash', label: 'Trash', icon: Trash2 },
]

interface SidebarProps {
  className?: string
  onNavigate?: () => void
  showClose?: boolean
  onClose?: () => void
}

export function Sidebar({
  className,
  onNavigate,
  showClose,
  onClose,
}: SidebarProps) {
  const { countByFolder } = useNotes()

  return (
    <aside
      className={cn(
        'flex h-full w-[240px] shrink-0 flex-col border-r border-sn-line bg-white',
        className,
      )}
    >
      <div className="flex items-center justify-between px-5 py-5">
        <Logo />
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-sn-muted hover:bg-sn-bg hover:text-sn-navy"
            aria-label="メニューを閉じる"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                      isActive
                        ? 'bg-sn-blue text-white shadow-sm'
                        : 'text-sn-ink hover:bg-sn-blue-soft',
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>

        <div className="mt-6 px-2">
          <p className="mb-2 text-[11px] font-bold tracking-wide text-sn-muted">
            FOLDERS
          </p>
          <ul className="space-y-1">
            {FOLDERS.map((f) => (
              <li key={f.id}>
                <NavLink
                  to={`/folders/${f.id}`}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition',
                      isActive
                        ? 'bg-sn-blue-soft text-sn-blue'
                        : 'text-sn-ink hover:bg-sn-bg',
                    )
                  }
                >
                  <span className="inline-flex items-center gap-2">
                    <Folder className="h-4 w-4" style={{ color: f.color }} />
                    {f.name}
                  </span>
                  <span className="text-xs text-sn-muted">
                    {countByFolder[f.id]}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="flex items-center gap-1 border-t border-sn-line px-3 py-3">
        <NavLink
          to="/search"
          onClick={onNavigate}
          className="rounded-lg p-2 text-sn-muted hover:bg-sn-bg hover:text-sn-blue"
          aria-label="検索"
        >
          <Search className="h-5 w-5" />
        </NavLink>
        <NavLink
          to="/settings"
          onClick={onNavigate}
          className="rounded-lg p-2 text-sn-muted hover:bg-sn-bg hover:text-sn-blue"
          aria-label="設定"
        >
          <Settings className="h-5 w-5" />
        </NavLink>
        <a
          href="#help"
          onClick={onNavigate}
          className="rounded-lg p-2 text-sn-muted hover:bg-sn-bg hover:text-sn-blue"
          aria-label="ヘルプ"
        >
          <HelpCircle className="h-5 w-5" />
        </a>
      </div>
    </aside>
  )
}
