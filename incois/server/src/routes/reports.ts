import { Router } from 'express'
import multer from 'multer'
import { z } from 'zod'
import { query } from '../db'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } })

const createReportSchema = z.object({
  userId: z.string().uuid().optional(),
  eventType: z.enum(['tsunami','high_waves','flood','unusual_tide','debris','distress','other']),
  description: z.string().max(2000).optional(),
  severity: z.enum(['low','medium','high']),
  language: z.string().optional(),
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
})

router.post('/', upload.array('media'), async (req, res) => {
  const parsed = createReportSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() })
  }
  const { userId, eventType, description, severity, lat, lon } = parsed.data
  // TODO: persist media to object store; for now, omit storing media
  const sql = `INSERT INTO reports (user_id, geom, event_type, description, severity)
               VALUES ($1, ST_SetSRID(ST_MakePoint($2,$3),4326), $4, $5, $6)
               RETURNING id, ST_Y(geom) as lat, ST_X(geom) as lon, event_type as "eventType", description, severity, status, verification_score as "verificationScore", timestamp`;
  const { rows } = await query(sql, [userId ?? null, lon, lat, eventType, description ?? null, severity])
  return res.status(201).json({
    id: rows[0].id,
    eventType: rows[0].eventType,
    description: rows[0].description,
    severity: rows[0].severity,
    status: rows[0].status,
    verificationScore: rows[0].verificationScore,
    timestamp: rows[0].timestamp,
    location: { lat: rows[0].lat, lon: rows[0].lon },
    media: [],
  })
})

router.get('/', async (req, res) => {
  const { bbox, from, to, limit = '200', offset = '0' } = req.query as Record<string,string>
  const where: string[] = []
  const params: any[] = []
  if (bbox) {
    const [minLng, minLat, maxLng, maxLat] = bbox.split(',').map(Number)
    params.push(minLng, minLat, maxLng, maxLat)
    where.push('geom && ST_MakeEnvelope($' + (params.length-3) + ', $' + (params.length-2) + ', $' + (params.length-1) + ', $' + params.length + ', 4326)')
  }
  if (from) { params.push(from); where.push('timestamp >= $' + params.length) }
  if (to)   { params.push(to);   where.push('timestamp <= $' + params.length) }
  params.push(Number(limit), Number(offset))
  const sql = `SELECT id, ST_Y(geom) as lat, ST_X(geom) as lon, event_type as "eventType", description, severity, status, verification_score as "verificationScore", timestamp
               FROM reports ${where.length? 'WHERE '+where.join(' AND '): ''}
               ORDER BY timestamp DESC LIMIT $${params.length-1} OFFSET $${params.length}`
  const { rows } = await query(sql, params)
  return res.json(rows.map(r => ({
    id: r.id,
    eventType: r.eventType,
    description: r.description,
    severity: r.severity,
    status: r.status,
    verificationScore: r.verificationScore,
    timestamp: r.timestamp,
    location: { lat: r.lat, lon: r.lon },
    media: [],
  })))
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const sql = `SELECT id, ST_Y(geom) as lat, ST_X(geom) as lon, event_type as "eventType", description, severity, status, verification_score as "verificationScore", timestamp
               FROM reports WHERE id=$1`
  const { rows } = await query(sql, [id])
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  const r = rows[0]
  return res.json({ id: r.id, eventType: r.eventType, description: r.description, severity: r.severity, status: r.status, verificationScore: r.verificationScore, timestamp: r.timestamp, location: { lat: r.lat, lon: r.lon }, media: [] })
})

router.post('/:id/verify', async (req, res) => {
  const { id } = req.params
  const body = z.object({
    verifierId: z.string().uuid().optional(),
    type: z.enum(['official','community']),
    decision: z.enum(['verified','false','escalated','duplicate']),
    comment: z.string().optional(),
  }).parse(req.body)

  await query(`INSERT INTO verifications (report_id, verifier_id, type, decision, comment) VALUES ($1,$2,$3,$4,$5)`, [id, body.verifierId ?? null, body.type, body.decision, body.comment ?? null])
  // simplistic status update
  let status = 'unverified'
  if (body.decision === 'verified') status = 'verified'
  else if (body.decision === 'false') status = 'false'
  else if (body.decision === 'escalated') status = 'escalated'
  else if (body.decision === 'duplicate') status = 'duplicate'
  await query(`UPDATE reports SET status=$2 WHERE id=$1`, [id, status])
  const { rows } = await query(`SELECT id, ST_Y(geom) as lat, ST_X(geom) as lon, event_type as "eventType", description, severity, status, verification_score as "verificationScore", timestamp FROM reports WHERE id=$1`, [id])
  return res.json({
    report: { id: rows[0].id, eventType: rows[0].eventType, description: rows[0].description, severity: rows[0].severity, status: rows[0].status, verificationScore: rows[0].verificationScore, timestamp: rows[0].timestamp, location: { lat: rows[0].lat, lon: rows[0].lon }, media: [] },
    verification: { id: undefined, reportId: id, verifierId: body.verifierId ?? null, type: body.type, decision: body.decision, comment: body.comment ?? null, timestamp: new Date().toISOString() }
  })
})

export default router

