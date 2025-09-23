import { Prisma, STATUS } from '@prisma/client'
import { prisma } from '~/libs/prisma'
import { BookCreateDto, BookListQuery, BookUpdateDto } from '~/schemas/book.schema'
import { configFilters, normalizeTags, parseSort } from '~/utils/helpers'

export async function create(payload: BookCreateDto) {
  return prisma.book.create({
    data: {
      title: payload.title,
      author: payload.author,
      year: payload.year,
      status: payload.status,
      tags: normalizeTags(payload.tags)
    }
  })
}

export async function list(q: BookListQuery) {
  if (q.year_from && q.year_to && q.year_from > q.year_to) {
    const e: any = new Error('year_from must be <= year_to')
    e.status = 400
    throw e
  }

  const where: Prisma.BookWhereInput = {}
  if (q.q)
    where.OR = [{ title: { contains: q.q, mode: 'insensitive' } }, { author: { contains: q.q, mode: 'insensitive' } }]
  if (q.author) where.author = q.author
  if (q.status) where.status = q.status
  if (q.year_from || q.year_to) {
    where.year = {}
    if (q.year_from) where.year.gte = q.year_from
    if (q.year_to) where.year.lte = q.year_to
  }
  const tagList = Array.isArray(q.tag) ? q.tag : q.tag ? [q.tag] : []
  if (tagList.length) where.tags = { hasEvery: normalizeTags(tagList) }

  const orderBy = parseSort(q.sort)
  const skip = (q.page - 1) * q.limit

  const [total, data] = await Promise.all([
    prisma.book.count({ where }),
    prisma.book.findMany({ where, orderBy, skip, take: q.limit })
  ])

  const filterInput = {
    ...q,
    tag: tagList
  }
  const filters = configFilters(filterInput)

  return {
    data,
    meta: {
      page: q.page,
      limit: q.limit,
      total,
      totalPages: Math.ceil(total / q.limit),
      sort: q.sort ?? '-createdAt',
      ...(Object.keys(filters).length > 0 ? { filters: filters } : {})
    }
  }
}

export const getById = (id: string) => prisma.book.findUnique({ where: { id } })

export async function update(id: string, payload: BookUpdateDto) {
  const data: any = { ...payload }
  if (payload.tags) data.tags = normalizeTags(payload.tags)
  return prisma.book.update({ where: { id }, data })
}

export const remove = (id: string) =>
  prisma.book.update({
    where: { id },
    data: { status: STATUS.INACTIVE }
  })
