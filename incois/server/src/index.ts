import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import reportsRouter from './routes/reports'
import socialRouter from './routes/social'
import hotspotsRouter from './routes/hotspots'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(morgan('dev'))

app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/api/reports', reportsRouter)
app.use('/api/social', socialRouter)
app.use('/api/hotspots', hotspotsRouter)

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`API listening on :${port}`)
})

