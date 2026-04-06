import type { Metadata } from 'next'
import CatalogClient from './CatalogClient'

export const metadata: Metadata = {
  title: 'Каталог товаров | Luxhommè',
  description: 'Бытовая техника Luxhommè — паровые швабры, кухонная техника, спорт и аксессуары.',
}

export default function CatalogPage() {
  return <CatalogClient />
}
