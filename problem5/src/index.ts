import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import pino from 'pino-http'
import booksRouter from '~/routes/books.routes'
import { errorHandler } from '~/middlewares/error.middlewares'

const app = express()

// Logging
app.use(
  pino({
    level: process.env.LOG_LEVEL ?? 'info',
    serializers: {
      req(req) {
        return { method: req.method, url: req.url }
      }
    }
  })
)

// Security + parsers
app.use(helmet())
app.use(
  cors({
    origin(origin, cb) {
      const allow = (process.env.CORS_ORIGINS ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      if (!origin || allow.length === 0 || allow.includes(origin)) return cb(null, true)
      cb(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: true
  })
)
app.use(express.json({ limit: '100kb' }))
app.use(express.urlencoded({ extended: false, limit: '100kb' }))
app.use(compression())

// Routes
app.get('/healthz', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/v1/books', booksRouter)

// Errors
app.use(errorHandler)

export default app
