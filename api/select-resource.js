// POST /api/select-resource  { client, provider, id, name }
// Persists which resource a client reports on for a provider.
import { setResource } from './_lib/tokenStore.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return }
  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
  const { client = 'default', provider, id, name } = body || {}
  if (!provider || !id) { res.status(400).json({ error: 'provider and id required' }); return }
  await setResource(client, provider, { id, name })
  res.status(200).json({ ok: true })
}
