import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { SiteHeader } from '@/components/layout/site-header/SiteHeader'
import styles from './LegalLayout.module.css'

/**
 * Элемент раздела. Может быть:
 *  - строкой — выводится как <p>; переносы строк (двойной \n) превращаются в отдельные параграфы.
 *  - массивом строк — маркированный список.
 *  - React-нодой — произвольная разметка.
 */
export type LegalBlock = string | string[] | ReactNode

export interface LegalSection {
  id: string
  number: string
  title: string
  blocks: LegalBlock[]
}

export interface LegalLayoutProps {
  title: string
  subtitle?: string
  sections: LegalSection[]
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string')
}

function renderBlock(block: LegalBlock, key: number): ReactNode {
  if (typeof block === 'string') {
    const paragraphs = block
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
    if (paragraphs.length <= 1) {
      return <p key={key}>{block}</p>
    }
    return (
      <Fragment key={key}>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </Fragment>
    )
  }
  if (isStringArray(block)) {
    return (
      <ul key={key}>
        {block.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    )
  }
  return <Fragment key={key}>{block}</Fragment>
}

export function LegalLayout({ title, subtitle, sections }: LegalLayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <SiteHeader solid />
      </div>

      <div className={styles.content}>
        <div className={styles.titleBlock}>
          <div className={styles.titleDividerTop} />
          <div className={styles.titleInner}>
            <h1 className={styles.title}>{title}</h1>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          </div>
          <div className={styles.titleDividerBottom} />
        </div>

        <div className={styles.sections}>
          {sections.map((section) => (
            <section key={section.id} className={styles.section}>
              <h2 className={styles.sectionHeading}>
                {section.number}. {section.title}
              </h2>
              <div className={styles.sectionBody}>
                {section.blocks.map((block, i) => renderBlock(block, i))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
