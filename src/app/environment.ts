if (!process.env.SALABLE_API_KEY) throw new Error('Missing env SALABLE_API_KEY')
if (!process.env.DATABASE_URL) throw new Error('Missing env DATABASE_URL')
if (!process.env.SESSION_COOKIE_NAME) throw new Error('Missing env SESSION_COOKIE_NAME')
if (!process.env.SESSION_COOKIE_PASSWORD) throw new Error('Missing env SESSION_COOKIE_PASSWORD')

const SALABLE_API_KEY = process.env.SALABLE_API_KEY
const DATABASE_URL = process.env.DATABASE_URL
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME
const SESSION_COOKIE_PASSWORD = process.env.SESSION_COOKIE_PASSWORD

export const env = {
  SALABLE_API_KEY,
  DATABASE_URL,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_PASSWORD
}