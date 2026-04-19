import { permanentRedirect } from 'next/navigation'

/** Список товаров живёт на маркетинговой странице `/catalog`. */
export default function ProductsIndexRedirect() {
  permanentRedirect('/catalog')
}
