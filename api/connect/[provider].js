// GET /api/connect/<provider>?client=<id>
// Builds the provider authorize URL (with signed state) and 302-redirects the client.
// If the provider has no real credentials configured, runs a demo connect instead.
import { PROVIDERS, STORE_PROVIDERS, APP_BASE } from '../_lib/config.js'
import { signState } from '../_lib/state.js'
import { buildAuthUrl } from '../_lib/providers.js'
import { saveConnection } from '../_lib/tokenStore.js'

export default async function handler(req, res) {
  const provider = req.query.provider
  const clientId = req.query.client || 'default'
  const p = PROVIDERS[provider]
  const isStore = STORE_PROVIDERS.includes(provider)

  if (!p && !isStore) { res.status(404).json({ error: 'unknown provider' }); return }

  const done = (extra = '') => {
    res.writeHead(302, { Location: `${APP_BASE}/?connected=${provider}&client=${encodeURIComponent(clientId)}${extra}` })
    res.end()
  }

  // Real OAuth available → redirect to the provider consent screen
  if (p && p.enabled) {
    const state = signState({ clientId, provider })
    res.writeHead(302, { Location: buildAuthUrl(provider, state) })
    res.end()
    return
  }

  // Demo mode: simulate a successful connection so the prototype works end-to-end
  await saveConnection(clientId, provider, { demo: true, connectedAt: Date.now() })
  done('&demo=1')
}
