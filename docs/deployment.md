# Deployment

## Overview

The project is configured for self-hosted deployment using Docker. The setup includes three services: the Next.js app, PostgreSQL database, and nginx reverse proxy.

## Docker Files

### `docker/Dockerfile`

Multi-stage build:
1. **dependencies** -- installs node_modules
2. **builder** -- builds the Next.js app with `output: 'standalone'`
3. **runner** -- minimal production image (only server.js, public/, .next/static/)

Uses Node.js 22 slim. Runs as non-root user `nextjs`.

### `docker/docker-compose.yml`

Three services:
- **app** -- Next.js application (port 3000)
- **db** -- PostgreSQL 17 Alpine (for Better Auth sessions and app data)
- **nginx** -- Reverse proxy (ports 80, 443)

### `docker/nginx.conf`

- Proxies all requests to Next.js on port 3000
- Disables buffering for Server Components streaming/Suspense (`proxy_buffering off`)
- Caches `/_next/static` for 1 year (immutable)
- Caches `/images` for 30 days

## Build and Deploy

```bash
# Build and start all services
cd docker
docker compose up -d --build

# View logs
docker compose logs -f app

# Rebuild after code changes
docker compose up -d --build app

# Stop all services
docker compose down

# Stop and remove volumes (WARNING: deletes database)
docker compose down -v
```

## Environment Variables

Create a `.env` file in the project root (not `.env.local` -- Docker reads `.env`):

### Site Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Yes | `http://localhost:3000` | Public site URL |
| `NEXT_PUBLIC_SITE_NAME` | Yes | `My Site` | Site display name |
| `SITE_TYPE` | No | `landing` | Informational hint (landing/corporate/ecommerce) |

### Feature Flags

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_FEATURE_BLOG` | `false` | Enable blog module |
| `NEXT_PUBLIC_FEATURE_AUTH` | `false` | Enable authentication |
| `NEXT_PUBLIC_FEATURE_DASHBOARD` | `false` | Enable user dashboard |
| `NEXT_PUBLIC_FEATURE_SHOP` | `false` | Enable e-commerce |
| `NEXT_PUBLIC_FEATURE_CHAT` | `false` | Enable chat widget |
| `NEXT_PUBLIC_FEATURE_PAYMENT` | `false` | Enable payment processing |
| `NEXT_PUBLIC_FEATURE_I18N` | `false` | Enable internationalization |

### CMS

| Variable | Required | Description |
|----------|----------|-------------|
| `CMS_PROVIDER` | Yes | `none`, `wordpress`, or `payload` |
| `WORDPRESS_GRAPHQL_URL` | If wordpress | WPGraphQL endpoint URL |
| `WP_APPLICATION_USER` | If wordpress | WordPress username for previews |
| `WP_APPLICATION_PASSWORD` | If wordpress | Application password |
| `WP_PREVIEW_SECRET` | If wordpress | Preview mode secret |
| `PAYLOAD_API_URL` | If payload | Payload CMS API URL |
| `PAYLOAD_API_KEY` | If payload | Payload API key |

### Authentication

| Variable | Required | Description |
|----------|----------|-------------|
| `BETTER_AUTH_SECRET` | If auth | Min 32 chars. Generate: `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | If auth | App URL for callbacks |
| `DATABASE_URL` | If auth | PostgreSQL connection string |
| `GITHUB_CLIENT_ID` | No | GitHub OAuth app ID |
| `GITHUB_CLIENT_SECRET` | No | GitHub OAuth secret |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth secret |

### Payment

| Variable | Required | Description |
|----------|----------|-------------|
| `PAYMENT_PROVIDER` | If payment | `none`, `stripe`, or `yookassa` |
| `STRIPE_SECRET_KEY` | If stripe | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | If stripe | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | If stripe | Webhook signing secret |

### Other

| Variable | Required | Description |
|----------|----------|-------------|
| `CHAT_PROVIDER` | If chat | `none`, `intercom`, `tawkto`, `custom` |
| `CHAT_API_KEY` | If chat | Chat provider API key |
| `REVALIDATION_SECRET` | Recommended | Secret for ISR webhook |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | If i18n | Default locale (e.g., `en`) |
| `NEXT_PUBLIC_LOCALES` | If i18n | Comma-separated locales (e.g., `en,ru`) |

## Database Setup

PostgreSQL is provided via Docker Compose. For the app to connect:

```env
DATABASE_URL=postgresql://bazasite:changeme@db:5432/bazasite
```

For Better Auth, run schema migration after first startup:
```bash
npx @better-auth/cli@latest generate
npx @better-auth/cli@latest migrate
```
