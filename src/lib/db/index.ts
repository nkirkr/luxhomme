import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL

function createDb() {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Cannot connect to the database.')
  }

  const client = postgres(connectionString, { prepare: false })
  return drizzle(client, { schema })
}

let _db: ReturnType<typeof createDb> | null = null

export function getDb() {
  if (!_db) {
    _db = createDb()
  }
  return _db
}

export type Database = ReturnType<typeof getDb>
