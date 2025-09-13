import { Request, Response, NextFunction } from 'express'
import * as booksService from '~/services/books.service'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { MESSAGE } from '~/constants/message'

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const book = await booksService.create(req.body)
    res.status(HTTP_STATUS.CREATED).json({ message: MESSAGE.BOOK.CREATED, data: book })
  } catch (e) {
    next(e)
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const parsedQuery = (res.locals.query as any) ?? (req.query as any)
    const out = await booksService.list(parsedQuery)
    res.json(out)
  } catch (e) {
    next(e)
  }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const book = await booksService.getById(req.params.id)
    if (!book) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: { message: MESSAGE.BOOK.NOT_FOUND } })
    res.json(book)
  } catch (e) {
    next(e)
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const book = await booksService.update(req.params.id, req.body)
    res.json({ message: MESSAGE.BOOK.UPDATED, data: book })
  } catch (e) {
    next(e)
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await booksService.remove(req.params.id)
    res.status(HTTP_STATUS.NO_CONTENT).send()
  } catch (e) {
    next(e)
  }
}
