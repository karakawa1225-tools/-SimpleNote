import { X } from 'lucide-react'
import { useNotes } from '@/context/NotesContext'

export function SaveErrorBanner() {
  const { saveError, clearSaveError } = useNotes()
  if (!saveError) return null

  return (
    <div className="fixed inset-x-0 top-0 z-[100] flex justify-center p-3 pointer-events-none">
      <div className="pointer-events-auto flex max-w-lg items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 shadow-lg">
        <p className="flex-1 font-semibold leading-6">{saveError}</p>
        <button
          type="button"
          onClick={clearSaveError}
          className="rounded-lg p-1 text-amber-800 hover:bg-amber-100"
          aria-label="閉じる"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
