export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { getAuth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

const handlers = toNextJsHandler(getAuth().handler)
export const GET = handlers.GET
export const POST = handlers.POST
