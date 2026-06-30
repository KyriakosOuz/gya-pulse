// Authorize-URL builders + code→token exchange for Google and Meta.
import { PROVIDERS } from './config.js'

export function buildAuthUrl(name, state) {
  const p = PROVIDERS[name]
  const u = new URL(p.authUrl)
  const q = u.searchParams
  q.set('client_id', p.clientId)
  q.set('redirect_uri', p.redirectUri)
  q.set('response_type', 'code')
  q.set('state', state)
  if (p.scopes) { // Google-style flow (google + merchant)
    q.set('scope', p.scopes.join(' '))
    q.set('access_type', 'offline')   // → refresh_token
    q.set('prompt', 'consent')        // → refresh_token even on re-auth
    q.set('include_granted_scopes', 'true')
  }
  if (name === 'meta') {
    if (p.configId) q.set('config_id', p.configId) // Facebook Login for Business
    else q.set('scope', 'ads_read,business_management')
  }
  return u.toString()
}

export async function exchangeCode(name, code) {
  const p = PROVIDERS[name]
  if (name !== 'meta') { // Google-style token exchange (google + merchant)
    const body = new URLSearchParams({
      code, client_id: p.clientId, client_secret: p.clientSecret,
      redirect_uri: p.redirectUri, grant_type: 'authorization_code',
    })
    const r = await fetch(p.tokenUrl, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
    return r.json()
  }
  if (name === 'meta') {
    const u = new URL(p.tokenUrl)
    u.searchParams.set('client_id', p.clientId)
    u.searchParams.set('client_secret', p.clientSecret)
    u.searchParams.set('redirect_uri', p.redirectUri)
    u.searchParams.set('code', code)
    const r = await fetch(u)
    const short = await r.json()
    if (short.access_token) {
      // upgrade to a long-lived (~60d) token
      const lu = new URL(p.tokenUrl)
      lu.searchParams.set('grant_type', 'fb_exchange_token')
      lu.searchParams.set('client_id', p.clientId)
      lu.searchParams.set('client_secret', p.clientSecret)
      lu.searchParams.set('fb_exchange_token', short.access_token)
      const lr = await fetch(lu)
      const long = await lr.json()
      return long.access_token ? long : short
    }
    return short
  }
  return { error: 'unknown_provider' }
}
