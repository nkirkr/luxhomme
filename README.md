# Bazasite

Модульный шаблон на **Next.js** (App Router) для лендингов, корпоративных сайтов и интернет-магазинов. Ядро всегда включено; блоки **блог, авторизация, личный кабинет, магазин, чат, оплата, i18n** подключаются через переменные окружения (`NEXT_PUBLIC_FEATURE_*`), без правок кода.

## Стек

| Слой           | Технологии                                                       |
| -------------- | ---------------------------------------------------------------- |
| Фреймворк      | Next.js 16, React 19, TypeScript                                 |
| Стили          | Tailwind CSS 4, shadcn/ui (42 компонента)                        |
| Анимации       | Motion v12, GSAP, AOS, AutoAnimate, Lottie, Magic UI, Aceternity |
| База данных    | Drizzle ORM + PostgreSQL                                         |
| Аутентификация | Better Auth                                                      |
| CMS            | адаптеры: WordPress (WPGraphQL), Payload или отключено           |
| Оплата         | адаптеры: Stripe, ЮKassa или отключено                           |
| Чат            | адаптеры: Tawk.to, Intercom или отключено                        |
| Email          | адаптеры: Resend или mock                                        |
| Аналитика      | Google Analytics, Яндекс.Метрика (через feature flag)            |
| Мониторинг     | Sentry (ошибки), Pino (логи), Web Vitals (метрики)               |
| Локализация    | next-intl (en/ru)                                                |
| Тема           | next-themes (light/dark)                                         |
| Тестирование   | Vitest (unit), Playwright (E2E)                                  |
| Code Quality   | ESLint, Prettier, Husky, lint-staged                             |
| CI/CD          | GitHub Actions (lint, test, build), Dependabot                   |
| Деплой         | Docker + nginx + PostgreSQL                                      |

## Требования

- **Node.js** 22+ (как в Docker-образе)
- **npm** (или совместимый менеджер пакетов)

## Быстрый старт

```bash
npm install
cp .env.example .env.local
# Отредактируйте .env.local: URL сайта, флаги модулей, CMS и т.д.
npm run dev
```

Приложение: [http://localhost:3000](http://localhost:3000).

Полная инструкция (включая пресеты `.env`): [**docs/README.md**](docs/README.md).

## Скрипты

| Команда                | Назначение                         |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Режим разработки (Turbopack)       |
| `npm run build`        | Production-сборка                  |
| `npm run start`        | Запуск после `build`               |
| `npm run lint`         | ESLint                             |
| `npm run format`       | Prettier — форматировать все файлы |
| `npm run format:check` | Prettier — проверить без изменений |
| `npm run test`         | Vitest — unit-тесты                |
| `npm run test:watch`   | Vitest — watch-режим               |
| `npm run test:e2e`     | Playwright — E2E-тесты             |
| `npm run test:e2e:ui`  | Playwright — UI-режим              |
| `npm run db:generate`  | Drizzle — сгенерировать миграции   |
| `npm run db:migrate`   | Drizzle — применить миграции       |
| `npm run db:push`      | Drizzle — push схемы в БД          |
| `npm run db:studio`    | Drizzle Studio — UI для БД         |

## Переменные окружения

Шаблон всех переменных — [**.env.example**](.env.example). Основные группы:

- **Сайт:** `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME`, `SITE_TYPE`
- **Модули:** `NEXT_PUBLIC_FEATURE_BLOG`, `_AUTH`, `_SHOP`, `_CHAT`, `_PAYMENT`, `_I18N`
- **CMS:** `CMS_PROVIDER` + URL/ключи WordPress или Payload
- **Auth / БД:** `BETTER_AUTH_*`, `DATABASE_URL`
- **Оплата:** `PAYMENT_PROVIDER`, `STRIPE_*`, `YOOKASSA_*`
- **Чат:** `CHAT_PROVIDER`, `NEXT_PUBLIC_TAWKTO_*`, `NEXT_PUBLIC_INTERCOM_*`
- **Email:** `EMAIL_PROVIDER`, `RESEND_API_KEY`, `EMAIL_FROM`
- **Аналитика:** `NEXT_PUBLIC_FEATURE_ANALYTICS`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_YM_ID`
- **Sentry:** `NEXT_PUBLIC_FEATURE_SENTRY`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`
- **i18n:** `NEXT_PUBLIC_DEFAULT_LOCALE`, `NEXT_PUBLIC_LOCALES`

Все env-переменные валидируются через Zod при сборке (`src/lib/env.ts`).

## Docker

Сборка в режиме `standalone`: приложение, PostgreSQL и nginx.

```bash
cd docker
docker compose up -d --build
```

Подробности: [**docs/deployment.md**](docs/deployment.md).

## Документация

| Документ                                           | Содержание                                    |
| -------------------------------------------------- | --------------------------------------------- |
| [docs/README.md](docs/README.md)                   | Быстрый старт, пресеты конфигурации           |
| [docs/architecture.md](docs/architecture.md)       | Архитектура, маршруты, диаграммы              |
| [docs/modules.md](docs/modules.md)                 | Модули, адаптеры (CMS, оплата, чат, email)    |
| [docs/database.md](docs/database.md)               | База данных: Drizzle ORM, схема, миграции     |
| [docs/testing.md](docs/testing.md)                 | Тестирование: Vitest, Playwright              |
| [docs/code-quality.md](docs/code-quality.md)       | ESLint, Prettier, Husky, lint-staged          |
| [docs/monitoring.md](docs/monitoring.md)           | Sentry, Pino, аналитика, Web Vitals           |
| [docs/security.md](docs/security.md)               | Заголовки, rate limiting, env-валидация, GDPR |
| [docs/cms-integration.md](docs/cms-integration.md) | Подключение CMS                               |
| [docs/feature-flags.md](docs/feature-flags.md)     | Флаги функций                                 |
| [docs/deployment.md](docs/deployment.md)           | Деплой и Docker                               |
| [docs/design-workflow.md](docs/design-workflow.md) | Дизайн и Figma                                |
| [docs/animations.md](docs/animations.md)           | Анимации                                      |
| [docs/seo-geo.md](docs/seo-geo.md)                 | SEO                                           |

## Лицензия

Проект помечен как `private` в `package.json`; при публикации добавьте файл лицензии по необходимости.
