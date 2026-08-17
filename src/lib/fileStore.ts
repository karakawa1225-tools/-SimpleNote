/** 写真・PDFの実ファイルを端末内 IndexedDB に保存（localStorage より大容量） */

const DB_NAME = 'simplenote.files.v1'
const STORE = 'files'
const DB_VERSION = 1

export interface StoredFile {
  id: string
  name: string
  mime: string
  blob: Blob
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error ?? new Error('IndexedDB open failed'))
  })
}

export async function putFile(file: StoredFile): Promise<void> {
  const db = await openDb()
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error ?? new Error('IndexedDB write failed'))
      tx.objectStore(STORE).put(file)
    })
  } finally {
    db.close()
  }
}

export async function getFile(id: string): Promise<StoredFile | null> {
  const db = await openDb()
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly')
      const req = tx.objectStore(STORE).get(id)
      req.onsuccess = () => resolve((req.result as StoredFile | undefined) ?? null)
      req.onerror = () => reject(req.error ?? new Error('IndexedDB read failed'))
    })
  } finally {
    db.close()
  }
}

export async function deleteFile(id: string): Promise<void> {
  const db = await openDb()
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error ?? new Error('IndexedDB delete failed'))
      tx.objectStore(STORE).delete(id)
    })
  } finally {
    db.close()
  }
}

export async function deleteFiles(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => deleteFile(id)))
}

export function downloadBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
}
