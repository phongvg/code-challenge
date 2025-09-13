import { ZodSchema, ZodError } from 'zod'
import { Request, Response, NextFunction } from 'express'

export const validateBody =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body) as T
      next()
    } catch (e) {
      const err = e as ZodError
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', details: err.flatten() } })
    }
  }

export const validateQuery =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query) as T
      res.locals.query = parsed
      next()
    } catch (e) {
      const err = e as ZodError
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', details: err.flatten() } })
    }
  }

export const requireJson = (req: Request, res: Response, next: NextFunction) => {
  if (!req.is('application/json')) {
    return res.status(415).json({
      error: {
        code: 'UNSUPPORTED_MEDIA_TYPE',
        message: 'Content-Type must be application/json'
      }
    })
  }
  next()
}
