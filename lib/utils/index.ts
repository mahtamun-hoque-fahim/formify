import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12)

export function generateId(): string {
  return nanoid()
}

// Slugify a string for form URLs
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Hash an IP address for privacy-preserving abuse detection
export async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(ip + process.env.BETTER_AUTH_SECRET)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Plan limit check — admin always bypasses
export function isOverLimit(
  role: string,
  plan: string,
  responseCount: number,
  activeForms: number
): { overResponseLimit: boolean; overFormLimit: boolean } {
  if (role === 'admin') return { overResponseLimit: false, overFormLimit: false }

  const limits = {
    free:  { responses: 100, forms: 3 },
    pro:   { responses: Infinity, forms: Infinity },
    team:  { responses: Infinity, forms: Infinity },
  }

  const limit = limits[plan as keyof typeof limits] ?? limits.free

  return {
    overResponseLimit: responseCount >= limit.responses,
    overFormLimit:     activeForms  >= limit.forms,
  }
}
