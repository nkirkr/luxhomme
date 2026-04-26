# Analyst Output — task-02-dashboard-integration

## Контекст задачи

Личный кабинет (4 страницы + общая шапка DashboardShell) работает на статических/хардкоженных данных. Нужно подключить его к реальному бэкенду WordPress + WooCommerce: читать данные пользователя, бонусы, заказы, отзывы и записывать изменения профиля и отзывов обратно. Попутно переименовать два slug'а (`/dashboard` → `/loyalty`, `/settings` → `/reviews`).

Дизайн и UI-компоненты уже полностью реализованы — задача исключительно на интеграцию с данными.

---

## Функциональные требования

### DashboardShell (общая шапка кабинета)

- **FR-SHELL-1:** Заменить статику «Иван Иванов» на реальное имя текущего пользователя из Better Auth сессии (`useSession()` → `session.user.name`).
- **FR-SHELL-2:** Заменить статику «500 бонусов» на реальное значение `bonus_balance` из WordPress user meta. Требуется серверный запрос к WP REST API.
- **FR-SHELL-3:** Кнопка «Выйти» должна вызывать `signOut()` из `auth-client.ts` и редиректить на главную.

### 1. Страница Loyalty (Программа лояльности)

- **FR-LOY-1:** Переименовать slug `/dashboard` → `/loyalty` (переместить `src/app/(dashboard)/dashboard/page.tsx` → `src/app/(dashboard)/loyalty/page.tsx`).
- **FR-LOY-2:** Получить с бэкенда (WP REST) user meta: `total_spent`, `user_rank`, `bonus_balance` для текущего пользователя.
- **FR-LOY-3:** Текущий уровень определяется по `user_rank` (или по `total_spent` через пороги: 0–14999 → newby, 15000–24999 → regular, 25000–44999 → silver, 45000–99999 → gold, 100000+ → platinum). Отображать название уровня (`levelName`) и следующий уровень (`levelNameNext`) динамически.
- **FR-LOY-4:** `progressArrow` перемещается по `progressTrack` пропорционально `total_spent` между min_amount текущего и следующего уровня (0–100% между двумя порогами).
- **FR-LOY-5:** `progressValue` показывает реальную сумму покупок (форматированная: `12 500 ₽`).
- **FR-LOY-6:** Бейджи (`badges`) обновляются: «X баллов» → реальный `bonus_balance`, «Кэшбек Y%» → `bonus_percent` текущего уровня.
- **FR-LOY-7:** Текущий уровень визуально подсвечен/активен (уточнить, если есть отдельные стили для каждого уровня — сейчас статика «Дорогой гость»).

### 2. Страница Profile (Данные)

- **FR-PRO-1:** Загрузить реальные данные из WordPress при маунте: `name` (display_name / first_name + last_name), `email`, `phone` (user meta), `address` (user meta: billing_address_1, billing_city, etc. или кастомная мета).
- **FR-PRO-2:** При нажатии «Сохранить» (handleSave) — отправить PUT/POST запрос к WP REST API, записать изменённые поля обратно в `wp_users` / `wp_usermeta`.
- **FR-PRO-3:** Показывать loading-состояние при загрузке и сохранении.
- **FR-PRO-4:** Обрабатывать ошибки сохранения (вывести сообщение пользователю).

### 3. Страница Orders (Заказы)

- **FR-ORD-1:** Заменить хардкоженный `ORDERS` массив на реальные данные из WooCommerce REST API (`GET /wp-json/wc/v3/orders?customer=<wp_user_id>`).
- **FR-ORD-2:** Маппинг полей заказа в существующий интерфейс `Order`:
  | WC Field | UI Field |
  |----------|----------|
  | `id` | `id` (формат: `№{id}`) |
  | `date_created` | `date`, `orderDate` (формат: DD.MM.YYYY) |
  | `status` | `status` (локализованный: pending→«В обработке», processing→«В обработке», completed→«Выполнен», cancelled→«Отменён», failed→«Не удался», on-hold→«На удержании», refunded→«Возвращён») |
  | `total` + `line_items.length` | `total` (формат: `X ₽ за N товар(ов)`) |
  | `shipping.method_title` или shipping lines | `deliveryMethod` |
  | `shipping.address_1` + `city` | `deliveryAddress` |
  | `date_completed` или estimated | `estimatedDelivery` |
  | `billing.phone` | `phone` |
  | `billing.first_name` + `last_name` | `fullName` |
  | `billing.email` | `email` |
  | `customer_note` | `comment` |
- **FR-ORD-3:** `OrderModal` показывает детали конкретного заказа (данные из того же WC response).
- **FR-ORD-4:** Пустое состояние (0 заказов) уже реализовано — оно корректно покажется, если API вернёт пустой массив.
- **FR-ORD-5:** Загрузка заказов при маунте с loading-состоянием.

### 4. Страница Reviews (Отзывы)

- **FR-REV-1:** Переименовать slug `/settings` → `/reviews` (переместить `src/app/(dashboard)/settings/page.tsx` → `src/app/(dashboard)/reviews/page.tsx`).
- **FR-REV-2:** Загрузить все отзывы текущего пользователя из WP REST: `GET /wp-json/luxhomme/v1/reviews?author=<wp_user_id>` (или аналогичный фильтр — уточнить endpoint).
- **FR-REV-3:** Маппинг полей отзыва:
  | WP Field | UI Field |
  |----------|----------|
  | `review_rating` | `rating` |
  | `post_date` | `date` (формат: «29 марта 2026») |
  | `post_content` | `text` |
  | `review_photos` (первое фото) | `photo` |
  | `review_source` | отображение иконки источника (ozon, wb, site) |
- **FR-REV-4:** При нажатии «Сохранить» в `EditModal` — отправить PUT/POST запрос к WP REST для обновления отзыва (rating, text, photo).
- **FR-REV-5:** Загрузка фото при редактировании — реализовать upload через FormData к `/api/reviews` (уже есть POST proxy).

### Slug-переименования и навигация

- **FR-NAV-1:** Переименовать `/dashboard` → `/loyalty` во всех местах:
  - Файловая структура: `src/app/(dashboard)/dashboard/` → `src/app/(dashboard)/loyalty/`
  - `NAV_ITEMS` в `DashboardShell.tsx`: `href: '/dashboard'` → `href: '/loyalty'`
  - Middleware: `AUTH_ROUTES` — `/dashboard` → `/loyalty`
  - Guest redirect: `/dashboard` → `/loyalty` в middleware
- **FR-NAV-2:** Переименовать `/settings` → `/reviews` во всех местах:
  - Файловая структура: `src/app/(dashboard)/settings/` → `src/app/(dashboard)/reviews/`
  - `NAV_ITEMS` в `DashboardShell.tsx`: `href: '/settings'` → `href: '/reviews'`
  - Middleware: `AUTH_ROUTES` — `/settings` → `/reviews`

---

## Нефункциональные требования

- **NFR-1:** Все запросы к WP REST API из Next.js должны идти через серверные API Routes (Route Handlers), чтобы не раскрывать WP credentials на клиенте.
- **NFR-2:** Запросы к WP требуют аутентификации (Basic Auth через WC Consumer Key/Secret или WP Application Password). Credentials берутся из существующих env-переменных (`WOOCOMMERCE_CONSUMER_KEY`, `WOOCOMMERCE_CONSUMER_SECRET`, `WP_APPLICATION_USER`, `WP_APPLICATION_PASSWORD`).
- **NFR-3:** Каждый API Route должен валидировать Better Auth сессию (`auth.api.getSession`) перед обращением к WP.
- **NFR-4:** Ошибки API не должны ронять UI — graceful degradation (fallback-значения, error states).
- **NFR-5:** Не менять существующий дизайн — только подключить данные.
- **NFR-6:** Не менять систему авторизации Better Auth.
- **NFR-7:** Не менять бэкенд-код бонусов WordPress — только читать через API.

---

## Затронутые части кодовой базы

### Файлы для изменения

| Файл                                                 | Что нужно сделать                                                                                         |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `src/app/(dashboard)/DashboardShell.tsx`             | Подключить `useSession()`, загрузить `bonus_balance`, добавить `signOut`, обновить `NAV_ITEMS` hrefs      |
| `src/app/(dashboard)/dashboard/page.tsx`             | **Переместить** в `loyalty/page.tsx`, подключить к данным loyalty (user meta)                             |
| `src/app/(dashboard)/profile/page.tsx`               | Заменить `USER_DATA` статику на fetch из API                                                              |
| `src/app/(dashboard)/profile/ProfileDataSection.tsx` | Реализовать `handleSave` — persist to API, добавить loading/error                                         |
| `src/app/(dashboard)/orders/page.tsx`                | Заменить `ORDERS` на fetch из WC API, обновить интерфейс `Order`                                          |
| `src/app/(dashboard)/settings/page.tsx`              | **Переместить** в `reviews/page.tsx`, подключить к WP reviews API, реализовать save в EditModal           |
| `middleware.ts`                                      | Обновить `AUTH_ROUTES`: `/dashboard`→`/loyalty`, `/settings`→`/reviews`; обновить `GUEST_ROUTES` redirect |
| `src/app/(dashboard)/layout.tsx`                     | Без изменений (feature flag остаётся)                                                                     |

### Новые файлы (API Routes)

| Файл                                     | Назначение                                                                                                                         |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/api/dashboard/user/route.ts`    | GET: данные пользователя (name, email, phone, address, bonus_balance, total_spent, user_rank) из WP. PUT: обновление профиля в WP. |
| `src/app/api/dashboard/orders/route.ts`  | GET: список заказов из WC REST (`/wc/v3/orders?customer=<id>`)                                                                     |
| `src/app/api/dashboard/reviews/route.ts` | GET: отзывы пользователя. PUT: обновление отзыва.                                                                                  |

### Существующие файлы-зависимости (без изменений)

| Файл                                       | Почему релевантен                                                                   |
| ------------------------------------------ | ----------------------------------------------------------------------------------- |
| `src/lib/auth.ts`                          | Server-side auth — `auth.api.getSession` для валидации в API Routes                 |
| `src/lib/auth-client.ts`                   | Client-side — `useSession`, `signOut`                                               |
| `src/lib/shop/woocommerce.ts`              | Паттерн `wcFetch` и `authHeader` для WC REST — можно переиспользовать               |
| `src/lib/env.ts`                           | Env-переменные: `WOOCOMMERCE_URL`, `WP_APPLICATION_USER`, `WP_APPLICATION_PASSWORD` |
| `src/app/api/reviews/route.ts`             | Существующий proxy для reviews — паттерн auth + forward                             |
| `src/app/(dashboard)/dashboard.module.css` | CSS Modules — без изменений, только стили                                           |

---

## Ограничения и зависимости

### Критическая зависимость: связь Better Auth ↔ WordPress User ID

- **Better Auth** хранит пользователей в SQLite (своя таблица `user`). Сессия возвращает `session.user.id`, `session.user.name`, `session.user.email`.
- **WordPress** хранит бонусы, заказы, отзывы привязанные к `wp_user_id` (WordPress user ID).
- **В текущем коде НЕТ маппинга** между Better Auth user ID и WordPress user ID. Это блокирующая зависимость.
- **Варианты решения** (выбор за архитектором):
  1. Хранить `wp_user_id` в Better Auth user metadata (при регистрации / первом логине — создавать/находить WP user и сохранять маппинг).
  2. Искать WP user по email или телефону (`GET /wp-json/wp/v2/users?search=<email>`).
  3. Синхронизировать при каждом запросе — по email матчить WP user.

### Зависимости от бэкенда (WordPress)

- WP REST API для чтения user meta (`bonus_balance`, `total_spent`, `user_rank`) должен быть доступен. Стандартный `/wp/v2/users/<id>` отдаёт только базовые поля; для кастомных meta нужен либо `register_rest_field()` на стороне WP, либо кастомный endpoint.
- WooCommerce REST API для заказов (`/wc/v3/orders`) — требует `customer` param (WP user ID).
- Custom REST endpoint `luxhomme/v1/reviews` — нужен фильтр по автору для получения отзывов конкретного пользователя.
- WP REST API для записи user data (PUT /wp/v2/users/<id>) — нужен Application Password или WC auth с правами.

### Что нельзя сломать

- Авторизация Better Auth (middleware, cookie, session) — не трогать.
- Feature flags (`NEXT_PUBLIC_FEATURE_DASHBOARD`, `NEXT_PUBLIC_FEATURE_AUTH`) — не трогать.
- Существующий UI/дизайн — не трогать стили.
- Бонусная система на стороне WordPress (`bonuses.php`) — только чтение.
- Существующий reviews proxy (`src/app/api/reviews/route.ts`) — для product detail page, не ломать.

### CORS

- CORS уже настроен на стороне WP для `https://luxhomme.ru` и `http://localhost:3000`. Но запросы к WP идут из Next.js серверных Route Handlers — CORS для них не нужен (server-to-server).

---

## Открытые вопросы

1. **Маппинг Better Auth → WP User ID.** В текущей кодовой базе нет связи между Better Auth `user.id` и WordPress `wp_user_id`. Как определить WP user ID для текущего пользователя? Варианты: (a) поиск по email, (b) поиск по телефону, (c) хранить маппинг в Better Auth user record. — **Критично для всех 4 страниц.**

2. **WP REST endpoint для user meta.** Стандартный `/wp/v2/users/<id>` не отдаёт кастомные мета (`bonus_balance`, `total_spent`, `user_rank`). Есть ли уже кастомный endpoint на стороне WP (например, `/wp-json/luxhomme/v1/user/me`), или нужно зарегистрировать rest fields? — **Критично для FR-SHELL-2, FR-LOY-2.**

3. **WP REST endpoint для обновления профиля.** Стандартный PUT `/wp/v2/users/<id>` требует admin-уровень прав. Есть ли кастомный endpoint для self-update, или нужно создать? — **Критично для FR-PRO-2.**

4. **Endpoint для отзывов пользователя.** Текущий `/luxhomme/v1/reviews` фильтрует по `product_id`. Поддерживает ли он фильтр по `author` (WP user ID) для получения всех отзывов пользователя? — **Критично для FR-REV-2.**

5. **Обновление отзыва.** Поддерживает ли `/luxhomme/v1/reviews` PUT/PATCH запросы для обновления существующего отзыва? — **Критично для FR-REV-4.**

6. **Уровни лояльности — изображения.** Сейчас для уровней используется одна картинка (`loyalty-level-1.jpg`). Есть ли уникальные изображения для каждого уровня? — **Желательно для FR-LOY-7.**

---

## Приоритеты и порядок реализации

| Приоритет | Блок                                                                  | Зависит от                            |
| --------- | --------------------------------------------------------------------- | ------------------------------------- |
| **P0**    | Решить маппинг Better Auth ↔ WP User ID                               | — (блокирует всё)                     |
| **P0**    | API Route: `/api/dashboard/user` (GET user data + meta)               | Маппинг, WP endpoint для meta         |
| **P1**    | DashboardShell — имя + баланс + logout                                | API `/api/dashboard/user`             |
| **P1**    | Slug-переименования (`/dashboard`→`/loyalty`, `/settings`→`/reviews`) | —                                     |
| **P2**    | Страница Loyalty — подключение к данным                               | API `/api/dashboard/user`             |
| **P2**    | Страница Profile — загрузка + сохранение                              | API `/api/dashboard/user` (GET + PUT) |
| **P2**    | API Route: `/api/dashboard/orders` (GET orders)                       | Маппинг (нужен wp_user_id для WC)     |
| **P2**    | Страница Orders — подключение к данным                                | API `/api/dashboard/orders`           |
| **P3**    | API Route: `/api/dashboard/reviews` (GET + PUT user reviews)          | Маппинг, WP endpoint                  |
| **P3**    | Страница Reviews — подключение к данным + save                        | API `/api/dashboard/reviews`          |
