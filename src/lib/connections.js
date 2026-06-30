// Client-side connection status (mirrors the server) so the Connect buttons reflect
// state immediately after the OAuth round-trip. Backed by localStorage.
const key = (c, p) => `gyaConn:${c}:${p}`

export function isConnected(clientId, provider) {
  try { return localStorage.getItem(key(clientId, provider)) === '1' } catch { return false }
}
export function setConnected(clientId, provider, v = true) {
  try { v ? localStorage.setItem(key(clientId, provider), '1') : localStorage.removeItem(key(clientId, provider)) } catch {}
}

const rkey = (c, p) => `gyaRes:${c}:${p}`
export function getResource(clientId, provider) {
  try { const v = localStorage.getItem(rkey(clientId, provider)); return v ? JSON.parse(v) : null } catch { return null }
}
export function saveResource(clientId, provider, resource) {
  try { localStorage.setItem(rkey(clientId, provider), JSON.stringify(resource)) } catch {}
}
