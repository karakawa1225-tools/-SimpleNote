import { FileText, Menu } from 'lucide-react'
import { Link, Outlet, useMatch, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { MobileBottomNav } from '@/components/MobileBottomNav'
import { NoteCard } from '@/components/NoteCard'
import { Sidebar } from '@/components/Sidebar'
import { useLayout } from '@/context/LayoutContext'
import { useNotes } from '@/context/NotesContext'
import { NewNotePage } from '@/pages/NewNotePage'
import { NoteDetailPage } from '@/pages/NoteDetailPage'
import { isEmbeddedFrame } from '@/lib/embed'
import { cn } from '@/lib/cn'

function MobileDrawer() {
  const { sidebarOpen, closeSidebar } = useLayout()

  return (
    <>
      <button
        type="button"
        className={cn(
          'fixed inset-0 z-40 bg-sn-navy/40 transition md:hidden',
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={closeSidebar}
        aria-label="メニューを閉じる"
      />
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Sidebar
          showClose
          onClose={closeSidebar}
          onNavigate={closeSidebar}
          className="h-dvh shadow-2xl"
        />
      </div>
    </>
  )
}

function DetailPlaceholder() {
  return (
    <div className="flex h-full min-h-[24rem] flex-col items-center justify-center gap-3 px-8 text-center">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sn-blue-soft text-sn-blue">
        <FileText className="h-7 w-7" />
      </div>
      <p className="font-display text-base font-bold text-sn-navy">
        NOTEを選択してください
      </p>
      <p className="text-sm leading-6 text-sn-muted">
        左の一覧やHOMEからNOTEを開くと、ここに詳細が表示されます。
      </p>
      <Link
        to="/new"
        className="mt-2 inline-flex rounded-xl bg-sn-blue px-4 py-2.5 text-sm font-bold text-white"
      >
        ＋ 新しいNOTE
      </Link>
    </div>
  )
}

function MasterListPanel() {
  const { activeNotes } = useNotes()
  const navigate = useNavigate()
  const match = useMatch('/notes/:id')
  const selectedId = match?.params.id

  return (
    <div className="px-4 py-5 md:px-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-black text-sn-navy">NOTE一覧</h2>
        <Link to="/new" className="text-xs font-bold text-sn-blue">
          ＋ 新規
        </Link>
      </div>
      <div className="space-y-3">
        {activeNotes.map((note) => (
          <div
            key={note.id}
            className={cn(
              'rounded-2xl transition',
              selectedId === note.id && 'ring-2 ring-sn-blue',
            )}
          >
            <NoteCard
              note={note}
              onClick={() => navigate(`/notes/${note.id}`)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function AppShell() {
  const embed = isEmbeddedFrame()
  const noteMatch = useMatch('/notes/:id')
  const isNew = Boolean(useMatch('/new'))
  const { openSidebar } = useLayout()

  if (embed) {
    return (
      <div className="relative flex h-dvh flex-col overflow-hidden bg-sn-bg">
        <main className="flex-1 overflow-y-auto pb-[4.5rem] scrollbar-hide">
          <Outlet />
        </main>
        <MobileBottomNav position="absolute" />
      </div>
    )
  }

  return (
    <div className="relative flex h-dvh overflow-hidden bg-sn-bg">
      <MobileDrawer />

      {/* ① サイドバー（タブレット・PC） */}
      <div className="hidden h-dvh shrink-0 overflow-y-auto md:block">
        <Sidebar />
      </div>

      {/* ② メイン（スマホは1画面 / タブレット・PCは中央） */}
      <div className="relative flex min-w-0 flex-1 flex-col md:border-r md:border-sn-line">
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-sn-line bg-white/95 px-4 py-3 backdrop-blur md:hidden">
          <button
            type="button"
            onClick={openSidebar}
            className="rounded-lg p-1 text-sn-navy"
            aria-label="メニューを開く"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Logo size="sm" />
        </div>
        <main className="flex-1 overflow-y-auto pb-24 md:pb-6">
          {noteMatch ? (
            <>
              <div className="hidden md:block">
                <MasterListPanel />
              </div>
              <div className="md:hidden">
                <NoteDetailPage />
              </div>
            </>
          ) : isNew ? (
            <NewNotePage />
          ) : (
            <Outlet />
          )}
        </main>
        <div className="md:hidden">
          <MobileBottomNav position="fixed" />
        </div>
      </div>

      {/* ③ 詳細（タブレット・PC）— 各ペインは縦スクロール */}
      <aside className="hidden h-dvh w-[min(42vw,420px)] shrink-0 overflow-y-auto bg-white md:block xl:w-[460px]">
        {noteMatch ? (
          <NoteDetailPage />
        ) : isNew ? (
          <MasterListPanel />
        ) : (
          <DetailPlaceholder />
        )}
      </aside>
    </div>
  )
}
