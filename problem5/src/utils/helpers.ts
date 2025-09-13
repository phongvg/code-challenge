import { Prisma } from '@prisma/client'

const SORT_WHITELIST = new Set(['title', 'author', 'year', 'createdAt'])

export function parseSort(sort?: string): Prisma.BookOrderByWithRelationInput {
  const raw = sort ?? '-createdAt'
  const field = raw.replace(/^-/, '')
  const dir = raw.startsWith('-') ? 'desc' : 'asc'
  if (!SORT_WHITELIST.has(field)) {
    const e: any = new Error(`Invalid sort field: ${field}`)
    e.status = 400
    throw e
  }
  return { [field]: dir } as Prisma.BookOrderByWithRelationInput
}

export function normalizeTags(tags?: string[]) {
  if (!tags) return []
  return [...new Set(tags.map((t) => t.trim()).filter(Boolean))].slice(0, 20)
}
