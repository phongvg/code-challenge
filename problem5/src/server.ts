import 'dotenv/config'
import app from './index'
import { prisma } from './libs/prisma'

const PORT = Number(process.env.PORT || 3000)

async function connectDB() {
  await prisma.$connect()
  await prisma.$runCommandRaw({ ping: 1 })
  console.log('MongoDB connected')
}

async function main() {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Cannot connect to MongoDB', err)
    process.exit(1)
  }
}

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

main()
