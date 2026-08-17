import { useEffect, useState } from 'react'
import { getFile } from '@/lib/fileStore'

/** IndexedDB の実ファイル、なければ data URL プレビュー */
export function useStoredFileUrl(
  id: string,
  fallback?: string,
): { url: string | null; loading: boolean } {
  const [url, setUrl] = useState<string | null>(
    fallback?.startsWith('data:') ? fallback : null,
  )
  const [loading, setLoading] = useState(!fallback?.startsWith('data:'))

  useEffect(() => {
    let objectUrl: string | null = null
    let cancelled = false

    void (async () => {
      try {
        const stored = await getFile(id)
        if (cancelled) return
        if (stored) {
          objectUrl = URL.createObjectURL(stored.blob)
          setUrl(objectUrl)
          setLoading(false)
          return
        }
        if (fallback?.startsWith('data:')) {
          setUrl(fallback)
        }
      } catch {
        if (!cancelled && fallback?.startsWith('data:')) setUrl(fallback)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [id, fallback])

  return { url, loading }
}
