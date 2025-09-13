import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { MESSAGE } from '~/constants/message'

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[ERROR]', { message: err?.message, stack: err?.stack, code: err?.code })
  }
  if (err.status) {
    return res.status(err.status).json({
      error: { code: err.code ?? 'ERROR', message: err.message }
    })
  }

  return res.status(HTTP_STATUS.INTERNAL).json({
    error: { code: 'INTERNAL', message: MESSAGE.ERROR.INTERNAL }
  })
}
