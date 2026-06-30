// Signed `state` for CSRF protection + carrying the client id through the OAuth round-trip.
import crypto from 'node:crypto'
import { STATE_SECRET } from './config.js'

const b64url = buf => Buffer.from(buf).toString('base64url')

export function signState(payload) {
  const body = b64url(JSON.stringify({ ...payload, t: Date.now() }))
  const sig = crypto.createHmac('sha256', STATE_SECRET).update(body).digest('base64url')
  return `${body}.${sig}`
}

export function verifyState(state) {
  if (!state || !state.includes('.')) return null
  const [body, sig] = state.split('.')
  const expect = crypto.createHmac('sha256', STATE_SECRET).update(body).digest('base64url')
  // constant-time compare
  const a = Buffer.from(sig), b = Buffer.from(expect)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  try {
    const data = JSON.parse(Buffer.from(body, 'base64url').toString())
    if (Date.now() - data.t > 1000 * 60 * 30) return null // 30-minute window
    return data
  } catch { return null }
}
