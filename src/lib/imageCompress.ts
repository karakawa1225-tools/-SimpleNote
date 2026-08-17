/** 添付画像を縮小・圧縮して localStorage でも保存できるサイズにする */

const DEFAULT_MAX_EDGE = 1280
const DEFAULT_QUALITY = 0.72
/** 1枚あたりの目安上限（Data URL 文字列長） */
const MAX_DATA_URL_CHARS = 450_000

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error ?? new Error('read failed'))
    reader.readAsDataURL(file)
  })
}

function canvasToJpeg(
  source: CanvasImageSource,
  width: number,
  height: number,
  quality: number,
): string {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas unsupported')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(source, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', quality)
}

/**
 * 画像を JPEG に圧縮。失敗時は元の Data URL（小さい場合）か空文字。
 */
export async function compressImageToDataUrl(file: File): Promise<string> {
  let maxEdge = DEFAULT_MAX_EDGE
  let quality = DEFAULT_QUALITY

  try {
    const bitmap = await createImageBitmap(file)
    try {
      for (let attempt = 0; attempt < 4; attempt++) {
        const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
        const w = Math.max(1, Math.round(bitmap.width * scale))
        const h = Math.max(1, Math.round(bitmap.height * scale))
        const dataUrl = canvasToJpeg(bitmap, w, h, quality)
        if (dataUrl.length <= MAX_DATA_URL_CHARS) return dataUrl
        maxEdge = Math.round(maxEdge * 0.75)
        quality = Math.max(0.45, quality - 0.12)
      }
      const scale = Math.min(1, 640 / Math.max(bitmap.width, bitmap.height))
      return canvasToJpeg(
        bitmap,
        Math.max(1, Math.round(bitmap.width * scale)),
        Math.max(1, Math.round(bitmap.height * scale)),
        0.45,
      )
    } finally {
      bitmap.close()
    }
  } catch {
    /* createImageBitmap 非対応など */
  }

  try {
    const raw = await readAsDataUrl(file)
    if (raw.length <= MAX_DATA_URL_CHARS) return raw

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('image load failed'))
      el.src = raw
    })
    const scale = Math.min(1, 960 / Math.max(img.naturalWidth, img.naturalHeight))
    return canvasToJpeg(
      img,
      Math.max(1, Math.round(img.naturalWidth * scale)),
      Math.max(1, Math.round(img.naturalHeight * scale)),
      0.6,
    )
  } catch {
    return ''
  }
}

export function estimateNotesJsonBytes(notes: unknown): number {
  try {
    return new Blob([JSON.stringify(notes)]).size
  } catch {
    return JSON.stringify(notes).length * 2
  }
}
