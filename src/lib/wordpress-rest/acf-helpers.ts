import { acfAttachmentId } from './pages'

export function acfTrimmedString(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined
  const t = v.trim()
  return t ? t : undefined
}

export function paragraphsFromAcfText(raw: string | undefined, fallback: string[]): string[] {
  if (!raw) return fallback
  const parts = raw
    .split(/\r?\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
  return parts.length > 0 ? parts : fallback
}

/** ACF Image: URL строкой, ID или объект — итоговый `src` для `<img>`. */
export function acfImageSrc(
  value: unknown,
  mediaById: Map<number, string>,
  fallback: string,
): string {
  if (typeof value === 'string') {
    const t = value.trim()
    if (/^https?:\/\//i.test(t)) return t
  }
  const id = acfAttachmentId(value)
  if (id !== undefined) {
    const u = mediaById.get(id)
    if (u) return u
  }
  return fallback
}
