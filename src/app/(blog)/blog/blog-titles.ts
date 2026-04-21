/** Единый разрыв строки перед брендом (как в макете hero / карточек). */
export function titleWithLuxhommeBreak(title: string): string {
  return title.replace(/\s+(Luxhommè|Luxhomme)\b/i, '\n$1')
}
