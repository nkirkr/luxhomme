### Контекст задачи

Реализовать полноценную систему отзывов для e-commerce сайта Luxhomme: хранение отзывов в WordPress CPT (Custom Post Type) через Carbon Fields, автоматический импорт 5-звёздочных отзывов с фото/видео из Wildberries API, отображение отзывов на странице товара (Next.js фронтенд), форма отправки отзыва с фронта в WordPress как черновик для модерации.

Система состоит из двух репозиториев:

- **Бэкенд**: `luxhomme-backend` (`~/Desktop/works/luxhomme-backend/wp-content/`) — WordPress + WooCommerce + Carbon Fields на VPS (172.30.30.196)
- **Фронтенд**: `luxhomme-new` (`~/Desktop/works/luxhomme-new/`) — Next.js, общается с WP через WooCommerce REST API

---

## Блок A: Бэкенд — CPT для отзывов (WordPress + Carbon Fields)

### Функциональные требования

- **FR-A1**: Зарегистрировать CPT `lh_review` (slug: `lh-review`) через `register_post_type()` с поддержкой `title`, `editor`, `thumbnail`. CPT не должен быть публичным в URL-маршрутах WP (`public: false`, `publicly_queryable: false`, `show_in_rest: true`).

- **FR-A2**: Подключить Carbon Fields мета-поля к CPT `lh_review`:
  - `review_rating` — radio (1–5), обязательное
  - `review_text` — textarea, текст отзыва
  - `review_photos` — media gallery (image), массив attachment ID
  - `review_product_id` — association (post_type: `product`), связка с WooCommerce товаром
  - `review_source` — select (`site`, `wb`, `ozon`), источник отзыва
  - `review_author_name` — text, имя автора (для внешних отзывов / анонимных с фронтенда)
  - `review_external_id` — text, ID отзыва из внешней системы (для дедупликации при импорте)

- **FR-A3**: Зарегистрировать REST API эндпоинты через `register_rest_route()` (namespace: `luxhomme/v1`):
  - `GET /luxhomme/v1/reviews?product_id={id}&page={n}&per_page={n}&source={source}` — получить опубликованные (`publish`) отзывы для товара, с пагинацией
  - `POST /luxhomme/v1/reviews` — создать отзыв со статусом `draft` (поля: product_id, rating, text, photos[], author_name). Поддержка multipart/form-data для загрузки фото.
  - `GET /luxhomme/v1/reviews/stats?product_id={id}` — средний рейтинг и количество отзывов для товара

- **FR-A4**: В ответе `GET /reviews` возвращать для каждого отзыва: `id`, `rating`, `text`, `author_name`, `source`, `photos[]` (массив URL), `date` (дата публикации), `product_id`.

- **FR-A5**: Валидация при `POST /reviews`: rating обязателен (1–5), text обязателен (мин. 10 символов), product_id обязателен и должен существовать как `product` в WooCommerce. Фото — опционально, макс. 5 файлов, только image/\*.

- **FR-A6**: В админке WordPress отзывы отображаются в разделе «Отзывы» бокового меню. Колонки в списке: товар (название), рейтинг (звёзды), источник, дата, статус (черновик/опубликован).

### Затронутые части кодовой базы (бэкенд)

- `~/Desktop/works/luxhomme-backend/wp-content/themes/norebro/functions.php` — текущий functions.php (2530+ строк), содержит кастомные WooCommerce поля (`_ozon_link`, `_wb_link`), meta boxes для preview-картинок, AJAX для корзины. **Строки 2346–2359**: вкладка отзывов WooCommerce отключена (`remove_reviews_tab`), комментарии к товарам запрещены (`disable_comments_for_products`). Это подтверждает, что стандартные WooCommerce reviews не используются — нужен отдельный CPT.
- `~/Desktop/works/luxhomme-backend/wp-content/plugins/carbon-fields/` — Carbon Fields уже установлен (v3.x, composer-based)
- `~/Desktop/works/luxhomme-backend/wp-content/mu-plugins/` — пустая директория, можно использовать для плагина отзывов (mu-plugin гарантирует автозагрузку)

### Ограничения и зависимости (блок A)

- Carbon Fields должен быть загружен **до** регистрации полей — использовать хук `carbon_fields_register_fields`
- Стандартные WooCommerce reviews отключены в текущем functions.php — это корректно, CPT будет независимым
- REST-эндпоинты должны работать **без аутентификации** для GET (чтение) и **с минимальной защитой** для POST (rate limiting + honeypot/nonce)
- Тема `norebro` — покупная, functions.php уже перегружен (~2530 строк). Рекомендуется вынести код отзывов в отдельный mu-plugin или обычный плагин, чтобы не раздувать functions.php

---

## Блок B: Импорт отзывов с Wildberries API

### Функциональные требования

- **FR-B1**: Скрипт/команда для получения отзывов через Wildberries API (`GET /api/v1/feedbacks`) с использованием `WILDBERRIES_API_KEY` из `.env.local` (или конфигурации WP).

- **FR-B2**: Фильтрация импортируемых отзывов: **только** с оценкой 5 звёзд **И** наличием фото или видео в ответе API.

- **FR-B3**: Создание отзыва в CPT `lh_review` с данными:
  - `review_rating`: значение из WB API
  - `review_text`: текст отзыва из WB
  - `review_photos`: скачать и сохранить фото в WP Media Library (через `media_sideload_image` или аналог)
  - `review_source`: `wb`
  - `review_author_name`: имя из WB (если доступно) или «Покупатель Wildberries»
  - `review_external_id`: ID фидбека из WB API (для дедупликации)
  - `review_product_id`: связка с WooCommerce товаром (по артикулу/SKU, маппинг нужно определить)
  - Статус: `publish` (импортированные отзывы сразу публикуются)

- **FR-B4**: Дедупликация: перед созданием проверять `review_external_id` — если отзыв с таким ID уже существует, пропускать.

- **FR-B5**: Механизм запуска:
  - WP-CLI команда для ручного запуска: `wp lh-reviews import-wb`
  - WP Cron: ежедневная автоматическая синхронизация
  - Альтернативно: Next.js API route / скрипт для ручного триггера

### Затронутые части кодовой базы

- `.env.local` (фронтенд) — `WILDBERRIES_API_KEY` уже есть (строка 87), JWT-токен
- WB API endpoint: `https://feedbacks-api.wildberries.ru/api/v1/feedbacks` (требует заголовок `Authorization: Bearer {token}`)
- Маппинг WB-товара → WooCommerce-товару: в functions.php уже есть поле `_wb_link` на товаре (строки 75–81), но нет SKU-маппинга. Нужен механизм привязки (по `nmId` WB → `_wb_product_id` meta в WooCommerce или ручной маппинг)

### Ограничения и зависимости (блок B)

- Блок B зависит от блока A (CPT + мета-поля должны быть зарегистрированы)
- WB API может возвращать отзывы постранично — нужна обработка пагинации
- Скачивание фото с WB CDN (basket-\*.wbbasket.ru) — проверить CORS/доступность с VPS
- API ключ WB хранится во фронтенд-репозитории в `.env.local`. Для бэкенд-скрипта на VPS нужно **также** добавить ключ в конфигурацию WordPress (wp-config.php / отдельный .env)
- Маппинг `nmId` (WB) → WooCommerce product ID — **критическая зависимость**. Без него невозможна автоматическая привязка отзывов к товарам. Варианты: (a) добавить мета-поле `_wb_product_id` к WooCommerce товару, (b) парсить `_wb_link` и извлекать ID, (c) маппинг через конфигурационный файл

---

## Блок C: Фронтенд — Вывод отзывов на странице товара

### Функциональные требования

- **FR-C1**: При загрузке страницы товара (`/products/[slug]`) запрашивать отзывы через REST API (`GET /luxhomme/v1/reviews?product_id={id}`). Данные загружать на сервере (SSR) или через client-side fetch при скролле к секции.

- **FR-C2**: Отображать отзывы в существующей секции `#product-reviews` (`reviewsSection` в `ProductTabs.tsx`). Текущая реализация рендерит `product.reviews` (строки 616–638) — массив пуст (`buildProductDetailForTabs` возвращает `reviews: []`, строка 575). Нужно подключить реальные данные.

- **FR-C3**: Карточка отзыва содержит: дату, бейдж источника (Ozon/WB/Сайт), звёзды рейтинга, имя автора, текст, фото(галерея). CSS-стили для карточки уже реализованы (`.reviewCard`, `.reviewCardTop`, `.reviewDate`, `.ozonBadge`, `.reviewRatingRow`, `.reviewAuthor`, `.reviewText`, `.reviewPhoto`).

- **FR-C4**: Бейдж источника: для `ozon` — иконка Ozon (уже есть `/icons/ozon-logo.svg`), для `wb` — иконка WB (нужно добавить `/icons/wb-logo.svg`), для `site` — иконка или текст «Luxhomme».

- **FR-C5**: Фильтры отзывов (уже есть в UI, строки 607–613): «Все», «С фото», «С видео», «Сначала положительные», «Сначала отрицательные». Сейчас фильтры нефункциональны — реализовать клиентскую или серверную фильтрацию/сортировку.

- **FR-C6**: Кнопка «Показать ещё» (строка 640) — подгрузка следующей страницы отзывов (пагинация).

- **FR-C7**: Средний рейтинг и количество отзывов (`ratingAvg`, строка 592) — получать из `GET /luxhomme/v1/reviews/stats?product_id={id}` вместо текущего `product.averageRating` (данные WooCommerce, которые сейчас не отражают CPT-отзывы).

### Затронутые части кодовой базы (фронтенд)

- `src/app/(shop)/products/[slug]/ProductTabs.tsx` (697 строк) — основной компонент с секцией отзывов. Текущая структура: `product.reviews.map()` рендерит карточки (строки 616–638), `REVIEW_FILTERS` массив (строки 24–30), `WriteReviewModal` компонент (строки 72–178), кнопка `btnReview` (строки 595–604)
- `src/app/(shop)/products/[slug]/product.module.css` (1725 строк) — CSS стили для всей секции отзывов (`.reviewsSection`, `.reviewCard`, `.reviewModal*`, `.filterBtn`, `.ozonBadge` и др.)
- `src/app/(shop)/products/[slug]/page.tsx` (139 строк) — серверный компонент, собирает данные через `buildProductDetailForTabs()` (строка 61)
- `src/lib/shop/product-detail-ui.ts` (616 строк) — `buildProductDetailForTabs()` возвращает `reviews: []` (строка 575), `ProductDetailForTabs.reviews` типизирован как `{ date: string; author: string; rating: number; text: string; photo: string }[]` (строка 35)
- `src/lib/shop/woocommerce.ts` (487 строк) — WooCommerce REST адаптер, `wcFetch()`, `authHeader()`, `BASE_URL`
- `src/lib/shop/types.ts` (84 строки) — типы `Product`, `ProductAdapter`

### Ограничения и зависимости (блок C)

- Блок C зависит от блока A (REST API эндпоинты должны быть доступны)
- Тип `ProductDetailForTabs.reviews[].photo` — сейчас `string` (одно фото). Нужно расширить до `photos: string[]` (массив) для поддержки галереи
- Бейдж `.ozonBadge` в CSS заточен под Ozon — нужен универсальный `.sourceBadge` с вариантами
- `WOOCOMMERCE_URL` = `https://wp.saudagar-group.ru` — REST-запросы пойдут на этот домен
- Кросс-доменные запросы: если REST API WP находится на `wp.saudagar-group.ru`, а фронтенд на другом домене — нужны CORS-заголовки на WP

---

## Блок D: Фронтенд — Форма отправки отзыва

### Функциональные требования

- **FR-D1**: Модальное окно `WriteReviewModal` (уже существует, строки 72–178) — доработать:
  - Заменить single file input на multiple (поддержка до 5 фото)
  - Добавить поле «Имя» (текстовый input)
  - Добавить превью загруженных фото

- **FR-D2**: При нажатии «Отправить» — отправка `POST /luxhomme/v1/reviews` с данными:
  - `product_id` — ID текущего товара
  - `rating` — выбранная оценка (1–5)
  - `text` — текст комментария
  - `author_name` — имя пользователя
  - `photos[]` — файлы фото (multipart/form-data)

- **FR-D3**: Состояния формы: loading (при отправке), success (отзыв отправлен на модерацию), error (ошибка отправки). После успеха показать сообщение «Спасибо! Ваш отзыв отправлен на модерацию» и закрыть модалку.

- **FR-D4**: Клиентская валидация: рейтинг >= 1, текст >= 10 символов (уже частично есть: `canSubmit = rating >= 1 && comment.trim().length > 0`), имя >= 2 символов.

### Затронутые части кодовой базы (фронтенд)

- `src/app/(shop)/products/[slug]/ProductTabs.tsx` — `WriteReviewModal` (строки 72–178), `WriteReviewStars` (строки 48–70)
- `src/app/(shop)/products/[slug]/product.module.css` — стили модалки (`.reviewModal*`, строки 1059–1246)
- Потребуется `product_id` в пропсах `WriteReviewModal` или `ProductTabs` — сейчас компонент не получает ID товара

### Ограничения и зависимости (блок D)

- Блок D зависит от блока A (POST эндпоинт)
- `ProductTabsProps.product` (тип `ProductDetailForTabs`) не содержит `product.id` — нужно добавить ID товара (WooCommerce product ID) в пропсы или прокинуть отдельно
- Загрузка фото: multipart/form-data через fetch API. Максимальный размер файла нужно ограничить (рекомендация: 5 МБ на файл)
- Защита от спама: как минимум debounce на кнопку, honeypot-поле, rate limiting на бэкенде

---

## Нефункциональные требования

- **NFR-1**: Время загрузки отзывов не должно влиять на LCP страницы товара. Загружать отзывы отложенно (client-side fetch) или через Suspense boundary.

- **NFR-2**: Кэширование: GET-запросы отзывов кэшировать с `revalidate: 300` (5 минут) на стороне Next.js или через HTTP cache headers на WP.

- **NFR-3**: REST API эндпоинты WP: rate limiting для POST (макс. 5 отзывов в час с одного IP), sanitization всех входных данных (`sanitize_text_field`, `wp_kses`).

- **NFR-4**: Фото отзывов: ресайз при загрузке на WP (макс. 1200×1200px), webp-конвертация (если плагин `webp-express` уже установлен).

- **NFR-5**: Мобильная адаптация: CSS для отзывов частично адаптирован (строки 1705–1725 в product.module.css). Убедиться что модалка, карточки и фильтры корректно работают на мобильных.

- **NFR-6**: SEO: отзывы должны быть доступны при серверном рендере (для Google structured data / rich snippets). Рассмотреть JSON-LD разметку `Review` / `AggregateRating`.

---

## Зависимости между блоками

```
Блок A (CPT + REST API)
  ↓
  ├── Блок B (Импорт WB) — зависит от A (CPT должен существовать)
  ├── Блок C (Вывод отзывов) — зависит от A (GET API)
  └── Блок D (Форма отзыва) — зависит от A (POST API)

Блок C и D могут разрабатываться параллельно после завершения A.
Блок B может разрабатываться параллельно с C/D после завершения A.
```

**Порядок реализации**: A → (B, C, D параллельно)

---

## Открытые вопросы

- **OQ-1**: Маппинг WB товаров → WooCommerce товарам: как определять, к какому WooCommerce product привязать отзыв из WB? Варианты: (a) мета-поле `_wb_product_id` (nmId) в товаре, (b) парсинг URL из `_wb_link`, (c) маппинг-таблица. — **Критично для блока B**.

- **OQ-2**: Где размещать код бэкенда: в `functions.php` (уже перегружен ~2530 строк) или отдельным mu-plugin / обычным плагином? — **Рекомендация: отдельный плагин** `luxhomme-reviews` в `wp-content/plugins/`.

- **OQ-3**: Нужна ли аутентификация пользователя для отправки отзыва с фронтенда? Сейчас на сайте есть система авторизации (`NEXT_PUBLIC_FEATURE_AUTH=true`, Better Auth). Если да — привязывать отзыв к пользователю. Если нет — только имя + email (опционально).

- **OQ-4**: Импорт отзывов с Ozon: в `.env.local` есть `OZON_SELLER_API_KEY` и `OZON_CLIENT_ID`. Нужно ли сейчас также импортировать отзывы с Ozon (источник `ozon`), или только WB?

- **OQ-5**: Фото/видео из WB: нужно ли поддерживать видео-отзывы (WB API может возвращать видео)? Или только фото?

- **OQ-6**: Нужна ли пагинация в фильтре «С видео»? WB-отзывы могут содержать видео, но текущий UI фронтенда не предусматривает видеоплеер.
