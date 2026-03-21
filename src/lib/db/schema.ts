import { pgTable, uuid, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core'

export const contacts = pgTable('contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject'),
  message: text('message').notNull(),
  status: text('status', { enum: ['new', 'read', 'replied', 'archived'] })
    .default('new')
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id'),
  email: text('email').notNull(),
  status: text('status', {
    enum: ['pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'],
  })
    .default('pending')
    .notNull(),
  totalAmount: integer('total_amount').notNull(),
  currency: text('currency').default('USD').notNull(),
  paymentProvider: text('payment_provider'),
  paymentId: text('payment_id'),
  items: jsonb('items').$type<OrderItem[]>().default([]).notNull(),
  shippingAddress: jsonb('shipping_address').$type<Address | null>(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Contact = typeof contacts.$inferSelect
export type NewContact = typeof contacts.$inferInsert
export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
export type Setting = typeof settings.$inferSelect

interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
}

interface Address {
  line1: string
  line2?: string
  city: string
  state?: string
  postalCode: string
  country: string
}
