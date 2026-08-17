const THUMB_EDGE = 320
const THUMB_QUALITY = 0.62
const FULL_EDGE = 1920
const FULL_QUALITY = 0.82

function canvasToJpegDataUrl(
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

function canvasToJpegBlob(
  source: CanvasImageSource,
  width: number,
  height: number,
  quality: number,
): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return Promise.reject(new Error('canvas unsupported'))
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(source, 0, 0, width, height)
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('toBlob failed'))
      },
      'image/jpeg',
      quality,
    )
  })
}

function scaledSize(
  width: number,
  height: number,
  maxEdge: number,
): { w: number; h: number } {
  const scale = Math.min(1, maxEdge / Math.max(width, height))
  return {
    w: Math.max(1, Math.round(width * scale)),
    h: Math.max(1, Math.round(height * scale)),
  }
}

async function withBitmap<T>(
  file: Blob,
  fn: (bitmap: ImageBitmap) => Promise<T>,
): Promise<T> {
  const bitmap = await createImageBitmap(file)
  try {
    return await fn(bitmap)
  } finally {
    bitmap.close()
  }
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const comma = dataUrl.indexOf(',')
  const header = comma >= 0 ? dataUrl.slice(0, comma) : 'data:image/jpeg;base64'
  const body = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl
  const mime = header.match(/data:([^;]+)/)?.[1] ?? 'image/jpeg'
  const binary = atob(body)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

export async function blobToThumb(blob: Blob): Promise<string> {
  try {
    return await withBitmap(blob, async (bitmap) => {
      const { w, h } = scaledSize(bitmap.width, bitmap.height, THUMB_EDGE)
      return canvasToJpegDataUrl(bitmap, w, h, THUMB_QUALITY)
    })
  } catch {
    return ''
  }
}

/** 実ファイル用の圧縮画像 + 一覧用の小さいサムネ */
export async function prepareImageFile(
  file: File,
): Promise<{ blob: Blob; thumb: string; mime: string }> {
  try {
    return await withBitmap(file, async (bitmap) => {
      const full = scaledSize(bitmap.width, bitmap.height, FULL_EDGE)
      const thumb = scaledSize(bitmap.width, bitmap.height, THUMB_EDGE)
      const [blob, thumbUrl] = await Promise.all([
        canvasToJpegBlob(bitmap, full.w, full.h, FULL_QUALITY),
        Promise.resolve(
          canvasToJpegDataUrl(bitmap, thumb.w, thumb.h, THUMB_QUALITY),
        ),
      ])
      return { blob, thumb: thumbUrl, mime: 'image/jpeg' }
    })
  } catch {
    const blob = file.slice(0, file.size, file.type || 'image/jpeg')
    const thumb = await blobToThumb(blob)
    return { blob, thumb, mime: file.type || 'image/jpeg' }
  }
}
