import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import * as booksController from '~/controllers/books.controllers'
import { validateBody, validateQuery, requireJson } from '~/middlewares/validation.middlewares'
import { BookCreateSchema, BookListQuerySchema, BookUpdateSchema } from '~/schemas/book.schema'

const router = Router()
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true
})

router.post('/', writeLimiter, requireJson, validateBody(BookCreateSchema), booksController.create)
router.get('/', validateQuery(BookListQuerySchema), booksController.list)
router.get('/:id', booksController.get)
router.post('/:id', writeLimiter, requireJson, validateBody(BookUpdateSchema), booksController.update)
router.delete('/:id', writeLimiter, booksController.remove)

export default router
