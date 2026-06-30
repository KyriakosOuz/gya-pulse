// Per-client token + connection storage.
// Uses Vercel KV (REST) when configured; otherwise an in-memory Map (dev only — does
// NOT persist across serverless invocations). Swap for KV/Postgres in production.
//
// SECURITY TODO: encrypt token blobs at rest (KMS / envelope encryption) before storing.
const mem = new Map()
const KV_URL = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN
const usingKV = !!(KV_URL && KV_TOKEN)

async function kvSet(key, value) {
  await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
  })
}
async function kvGet(key) {
  const r = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, { headers: { Authorization: `Bearer ${KV_TOKEN}` } })
  if (!r.ok) return null
  const j = await r.json()
  if (j.result == null) return null
  try { return typeof j.result === 'string' ? JSON.parse(j.result) : j.result } catch { return j.result }
}

const tokKey = (c, p) => `tok:${c}:${p}`
const connKey = c => `conn:${c}`

// Save the token blob for a client+provider AND update the client's connection summary.
export async function saveConnection(clientId, provider, payload) {
  const summary = (await getConnections(clientId)) || {}
  summary[provider] = { connected: true, demo: !!payload.demo, connectedAt: payload.connectedAt || Date.now() }
  if (usingKV) {
    await kvSet(tokKey(clientId, provider), payload)
    await kvSet(connKey(clientId), summary)
  } else {
    mem.set(tokKey(clientId, provider), payload)
    mem.set(connKey(clientId), summary)
  }
  return summary
}

export async function getConnections(clientId) {
  if (usingKV) return (await kvGet(connKey(clientId))) || {}
  return mem.get(connKey(clientId)) || {}
}

export async function getTokens(clientId, provider) {
  if (usingKV) return await kvGet(tokKey(clientId, provider))
  return mem.get(tokKey(clientId, provider)) || null
}

// Save which resource (GA4 property / ad account / merchant id) a client reports on.
export async function setResource(clientId, provider, resource) {
  const summary = (await getConnections(clientId)) || {}
  if (!summary[provider]) summary[provider] = { connected: true }
  summary[provider].resource = resource
  if (usingKV) await kvSet(connKey(clientId), summary)
  else mem.set(connKey(clientId), summary)
  return summary
}
