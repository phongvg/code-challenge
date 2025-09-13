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

export function configFilters(query: Record<string, any>): Record<string, any> {
  const filters: Record<string, any> = {}

  for (const [key, value] of Object.entries(query)) {
    if (
      value !== undefined &&
      value !== null &&
      (typeof value === 'string' ? value.trim() !== '' : true) &&
      !(Array.isArray(value) && value.length === 0)
    ) {
      filters[key] = value
    }
  }

  return filters
}
