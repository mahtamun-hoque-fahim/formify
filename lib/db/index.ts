import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Lazy singleton — prevents eager DB import crash on Edge (same fix as mockX)
let db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function getDb() {
  if (!db) {
    const sql = neon(process.env.DATABASE_URL!)
    db = drizzle(sql, { schema })
  }
  return db
}
