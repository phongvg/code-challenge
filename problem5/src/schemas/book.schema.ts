import { z } from 'zod'

export const Status = z.enum(['ACTIVE', 'INACTIVE'])

export const BookCreateSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    author: z.string().trim().max(120).optional(),
    year: z.number().int().min(0).max(9999).optional(),
    status: Status.optional(),
    tags: z.array(z.string().trim().min(1).max(30)).max(20).optional()
  })
  .strict()

export const BookUpdateSchema = BookCreateSchema.partial().strict()

export const BookListQuerySchema = z
  .object({
    q: z.string().trim().max(200).optional(),
    author: z.string().trim().max(120).optional(),
    status: Status.optional(),
    year_from: z.coerce.number().int().min(0).optional(),
    year_to: z.coerce.number().int().min(0).optional(),
    tag: z.union([z.string(), z.array(z.string())]).optional(),
    sort: z.string().default('-createdAt'),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10)
  })
  .strict()
