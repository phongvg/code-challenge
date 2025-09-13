import 'express'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL?: string
      PORT?: string
      NODE_ENV: 'development' | 'production'
      CORS_ORIGINS?: string
      LOG_LEVEL?: string
    }
  }
}
export {}
