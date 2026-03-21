# Database — Drizzle ORM + PostgreSQL

## Overview

The template uses **Drizzle ORM** with **PostgreSQL** for application data (contacts, orders, settings). Better Auth manages its own auth-related tables — Drizzle handles everything else.

PostgreSQL is already configured in `docker/docker-compose.yml`.

## Files

| File                   | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| `src/lib/db/index.ts`  | Singleton DB client (`getDb()`)                |
| `src/lib/db/schema.ts` | Table definitions (contacts, orders, settings) |
| `drizzle.config.ts`    | Migration config                               |
| `.env.example`         | `DATABASE_URL` template                        |

## Setup

### 1. Start PostgreSQL

```bash
cd docker
docker compose up -d db
```

Default connection: `postgresql://bazasite:changeme@localhost:5432/bazasite`

### 2. Set DATABASE_URL

In `.env.local`:

```env
DATABASE_URL=postgresql://bazasite:changeme@localhost:5432/bazasite
```

### 3. Push schema to DB (development)

```bash
npm run db:push
```

### 4. Or use migrations (production)

```bash
npm run db:generate   # generate SQL migration from schema changes
npm run db:migrate    # apply migrations
```

### 5. Browse data visually

```bash
npm run db:studio
```

Opens Drizzle Studio at `https://local.drizzle.studio`.

## Schema

Three base tables are included:

### contacts

Stores contact form submissions.

```typescript
import { contacts } from '@/lib/db/schema'

const db = getDb()

// Insert
await db.insert(contacts).values({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello!',
})

// Query
const newContacts = await db.select().from(contacts).where(eq(contacts.status, 'new'))
```

### orders

Stores e-commerce orders with items as JSONB.

```typescript
import { orders } from '@/lib/db/schema'

await db.insert(orders).values({
  email: 'buyer@example.com',
  totalAmount: 4999,
  currency: 'USD',
  paymentProvider: 'stripe',
  paymentId: 'pi_xxx',
  items: [{ productId: '1', name: 'Widget', quantity: 2, price: 2499 }],
})
```

### settings

Key-value store for site-wide settings.

```typescript
import { settings } from '@/lib/db/schema'

await db
  .insert(settings)
  .values({ key: 'maintenance_mode', value: false })
  .onConflictDoUpdate({
    target: settings.key,
    set: { value: false, updatedAt: new Date() },
  })
```

## Using the DB Client

```typescript
import { getDb } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const db = getDb()
  const allContacts = await db.select().from(contacts)
  return Response.json(allContacts)
}
```

`getDb()` returns a singleton — safe to call multiple times.

## Adding New Tables

1. Define the table in `src/lib/db/schema.ts`:

```typescript
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
```

2. Generate a migration:

```bash
npm run db:generate
```

3. Apply it:

```bash
npm run db:migrate
```

## Type Safety

Every table exports inferred types:

```typescript
import type { Contact, NewContact, Order, NewOrder } from '@/lib/db/schema'
```

- `Contact` — select type (all fields)
- `NewContact` — insert type (required fields only)
