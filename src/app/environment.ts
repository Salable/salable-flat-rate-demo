if (!process.env.SALABLE_API_KEY) throw new Error('Missing env SALABLE_API_KEY')
if (!process.env.NEXT_PUBLIC_SALABLE_API_BASE_URL) throw new Error('Missing env NEXT_PUBLIC_SALABLE_API_BASE_URL')
if (!process.env.DATABASE_URL) throw new Error('Missing env TURSO_DATABASE_URL')
if (!process.env.SESSION_COOKIE_NAME) throw new Error('Missing env SESSION_COOKIE_NAME')
if (!process.env.SESSION_COOKIE_PASSWORD) throw new Error('Missing env SESSION_COOKIE_PASSWORD')

const SALABLE_API_KEY = process.env.SALABLE_API_KEY
const SALABLE_API_BASE_URL = process.env.SALABLE_API_BASE_URL
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME
const SESSION_COOKIE_PASSWORD = process.env.SESSION_COOKIE_PASSWORD

export const env = {
  SALABLE_API_KEY,
  SALABLE_API_BASE_URL,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_PASSWORD
}