// GET /api/connections?client=<id> → which providers this client has connected.
import { getConnections } from './_lib/tokenStore.js'

export default async function handler(req, res) {
  const clientId = req.query.client || 'default'
  const connections = await getConnections(clientId)
  res.status(200).json({ client: clientId, connections })
}
