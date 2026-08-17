import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { SaveErrorBanner } from '@/components/SaveErrorBanner'
import { LayoutProvider } from '@/context/LayoutContext'
import { NotesProvider } from '@/context/NotesContext'
import { CalendarPage } from '@/pages/CalendarPage'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { FolderDetailPage } from '@/pages/FolderDetailPage'
import { FoldersPage } from '@/pages/FoldersPage'
import { HomePage } from '@/pages/HomePage'
import { LandingPage } from '@/pages/LandingPage'
import { NewNotePage } from '@/pages/NewNotePage'
import { NoteDetailPage } from '@/pages/NoteDetailPage'
import { NotesByDatePage } from '@/pages/NotesByDatePage'
import { NotesPage } from '@/pages/NotesPage'
import { SearchPage } from '@/pages/SearchPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { TrashPage } from '@/pages/TrashPage'

export default function App() {
  return (
    <NotesProvider>
      <BrowserRouter>
        <LayoutProvider>
          <SaveErrorBanner />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route element={<AppShell />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/notes/:id" element={<NoteDetailPage />} />
              <Route path="/day/:dateKey" element={<NotesByDatePage />} />
              <Route path="/new" element={<NewNotePage />} />
              <Route path="/folders" element={<FoldersPage />} />
              <Route path="/folders/:folderId" element={<FolderDetailPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/trash" element={<TrashPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </LayoutProvider>
      </BrowserRouter>
    </NotesProvider>
  )
}
