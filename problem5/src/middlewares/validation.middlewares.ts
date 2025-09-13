import { ZodSchema, ZodError } from 'zod'
import DOMPurify from 'isomorphic-dompurify'
import { Request, Response, NextFunction } from 'express'

function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return DOMPurify.sanitize(input.trim())
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item))
  }

  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value)
    }
    return sanitized
  }

  return input
}

export const validateBody =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const sanitizedBody = sanitizeInput(req.body)
      req.body = schema.parse(sanitizedBody) as T
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
