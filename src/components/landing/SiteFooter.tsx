import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'

const links = [
  { to: '/home', label: 'HOME' },
  { to: '/#features', label: 'SimpleNoteについて' },
  { to: '/settings', label: '利用規約' },
  { to: '/settings', label: 'プライバシーポリシー' },
  { to: '/settings', label: 'お問い合わせ' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-sn-line bg-sn-navy text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div>
          <Logo className="[&_span:last-child]:text-white" />
          <p className="mt-3 text-sm text-white/70">
            シンプルに書く。すぐに残す。
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-white/80">
          {links.map((l) => (
            <li key={l.label}>
              <Link to={l.to} className="hover:text-white">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        Copyright © SimpleNote
      </div>
    </footer>
  )
}
