/** LPの PhoneMockup iframe 内かどうか */
export function isEmbeddedFrame(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.self !== window.top
  } catch {
    return true
  }
}
