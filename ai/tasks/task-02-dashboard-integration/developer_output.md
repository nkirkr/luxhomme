# Developer Output — task-02-dashboard-integration

## Реализованные TODO

### TODO 2: Slug-переименования

```bash
mv src/app/(dashboard)/dashboard/ → src/app/(dashboard)/loyalty/
mv src/app/(dashboard)/settings/ → src/app/(dashboard)/reviews/
```

Относительные импорты `../DashboardShell` и `../dashboard.module.css` не изменились.

---

### TODO 1: `src/app/(dashboard)/DashboardShell.tsx`

- Обновлены `NAV_ITEMS`: `/dashboard` → `/loyalty`, `/settings` → `/reviews`
- Добавлены импорты: `useSession`, `signOut` из `@/lib/auth-client`, `fetchDashboardUser` из `@/lib/dashboard/api-client`, `useRouter`, `useEffect`, `useState`
- Имя пользователя: `session?.user?.name || 'Личный кабинет'`
- Баланс: загружается через `fetchDashboardUser()` → `bonusBalance` state
- Обе кнопки «Выйти»: `onClick` → `signOut(); router.push('/')`

---

### TODO 3: `src/app/(dashboard)/loyalty/page.tsx`

- Добавлен `'use client'`, убран `export const metadata`
- Загрузка данных через `fetchDashboardUser()` → `computeLoyaltyProgress()`
- Динамические значения: `levelName`, `levelFrom`, `levelNameNext`, `bonusBalance`, `bonusPercent`, `progressValue`, прогресс-бар `width`

---

### TODO 4: `src/app/(dashboard)/profile/page.tsx`

- Добавлен `'use client'`, убраны `metadata` и `USER_DATA`
- Загрузка через `fetchDashboardUser()`, маппинг в `ProfileData`
- Loading state: «Загрузка…» пока данные не получены

---

### TODO 5: `src/app/(dashboard)/profile/ProfileDataSection.tsx`

- `handleSave` реализован через `updateDashboardUser()`
- Добавлены `saving` и `error` states
- Кнопка «Сохранить»: `disabled={saving}`, текст меняется на «Сохранение…»
- Ошибка отображается красным текстом под формой

---

### TODO 6: `src/app/(dashboard)/orders/page.tsx`

- Убраны хардкоженные `Order` интерфейс и `ORDERS` массив
- Используется `DashboardOrder` из `@/lib/dashboard/types`
- Загрузка через `fetchDashboardOrders()` с `loading` state
- В столбце «Заказ»: `№${order.id}`
- `selectedOrder` типизирован как `DashboardOrder | null`

---

### TODO 7: `src/app/(dashboard)/reviews/page.tsx`

- Убран хардкоженный `REVIEWS` массив
- Загрузка через `fetchDashboardReviews()` с `loading` state
- `EditModal` получил пропс `onSave(id, rating, text)` и `saving` state
- При сохранении: `updateDashboardReview()` → обновление локального state
- Иконка source отображается только если `review.source !== 'site'`
- Все типы заменены на `DashboardReview`

---

### TODO 8: `middleware.ts`

- `AUTH_ROUTES`: `/dashboard` → `/loyalty`, `/settings` → `/reviews`
- Guest redirect: `/dashboard` → `/loyalty`

---

### TODO 9: PHP `functions.php`

Пропущен (уже сделано).

---

## Финальный отчёт

**Выполнено:** 8/8 TODO (TODO 9 был пропущен по инструкции)

**Замечания:**

- `DashboardShell` делает свой `fetchDashboardUser()`, а `loyalty/page.tsx` и `profile/page.tsx` делают свои — это 2–3 параллельных запроса к одному API. Если нужна оптимизация, можно поднять данные в shared context или SWR/React Query.
- В `ProfileDataSection` разбор адреса через `split(',')` хрупок — если пользователь вводит адрес в нестандартном формате, поля могут разъехаться. При необходимости стоит добавить отдельные поля ввода для города/индекса.
