import {
  CalendarDays,
  Folder,
  Home,
  Plus,
  Search,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'

export function MobileBottomNav({
  position = 'absolute',
}: {
  position?: 'absolute' | 'fixed'
}) {
  return (
    <nav
      className={cn(
        'safe-pb inset-x-0 bottom-0 z-20 border-t border-sn-line/80 bg-white/95 backdrop-blur',
        position === 'fixed' ? 'fixed' : 'absolute',
      )}
    >
      <ul className="grid h-16 grid-cols-5 items-end px-1">
        <li>
          <NavLink
            to="/home"
            end
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 pb-2 pt-2 text-[10px] font-semibold',
                isActive ? 'text-sn-blue' : 'text-sn-muted',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Home className="h-5 w-5" strokeWidth={isActive ? 2.4 : 2} />
                <span>HOME</span>
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 pb-2 pt-2 text-[10px] font-semibold',
                isActive ? 'text-sn-blue' : 'text-sn-muted',
              )
            }
          >
            {({ isActive }) => (
              <>
                <CalendarDays className="h-5 w-5" strokeWidth={isActive ? 2.4 : 2} />
                <span>カレンダー</span>
              </>
            )}
          </NavLink>
        </li>
        <li className="relative flex justify-center">
          <NavLink
            to="/new"
            className="absolute -top-5 flex h-14 w-14 items-center justify-center rounded-full bg-sn-blue text-white shadow-lg shadow-sn-blue/35 transition hover:bg-sn-blue-dark"
            aria-label="新しいNOTE"
          >
            <Plus className="h-7 w-7" strokeWidth={2.5} />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/folders"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 pb-2 pt-2 text-[10px] font-semibold',
                isActive ? 'text-sn-blue' : 'text-sn-muted',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Folder className="h-5 w-5" strokeWidth={isActive ? 2.4 : 2} />
                <span>フォルダ</span>
              </>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 pb-2 pt-2 text-[10px] font-semibold',
                isActive ? 'text-sn-blue' : 'text-sn-muted',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Search className="h-5 w-5" strokeWidth={isActive ? 2.4 : 2} />
                <span>検索</span>
              </>
            )}
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
